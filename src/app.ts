import path from "path";
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import session from "express-session";
import connectMongoDB from "connect-mongodb-session";
import csrf from "csurf";
import flash from "connect-flash";
import multer, { Options } from "multer";
import { randomBytes } from "crypto";

import User from "./models/user.model";
import adminRouter from "./routes/admin";
import shopRouter from "./routes/shop";
import authRouter from "./routes/auth";
import errorController from "./controllers/error.controller";

dotenv.config();
const app = express();
const csrfProtection = csrf();

//store session in mongodb
const MongoDbStore = connectMongoDB(session);
const store = new MongoDbStore({
    uri: process.env.MONGO_URL,
    collection: "sessions",
    databaseName: "shop",
    expires: 1000 * 60 * 60 * 24,
});

//configure store for user images
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        const unicName =
            Date.now() +
            "-" +
            randomBytes(8).toString("hex") +
            "-" +
            file.originalname.trim();
        cb(null, unicName);
    },
});
const fileFilter: Options["fileFilter"] = (req, file, cb) => {
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));
app.use("/images", express.static(path.join(__dirname, "../images")));
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));

//configure session
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

app.use(csrfProtection);
app.use(flash());

//save users model in request
app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user) {
        next();
    } else {
        try {
            const user = await User.findById(req.session.user._id);
            if (user) {
                req.user = user;
            }
        } catch (err) {
            next();
        }
        next();
    }
});

//pass user login mark and csrfToken for render page
app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use("/admin", adminRouter);
app.use(shopRouter);
app.use(authRouter);
app.get("/500", errorController.get500);
app.use(errorController.get404);

//catch connect to db errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    res.status(500).redirect("/500");
});

mongoose.connect(process.env.MONGO_URL, { dbName: "shop" }).then((result) => {
    app.listen(3000, () => {
        console.log("Server listen http://localhost:3000");
    });
});
