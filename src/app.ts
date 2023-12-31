import path from "path";
import express, {
    Request,
    Response,
    NextFunction,
    ErrorRequestHandler,
} from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import session from "express-session";
import connectMongoDB from "connect-mongodb-session";
import csrf from "csurf";
import flash from "connect-flash";

import User from "./models/user.model";
import adminRouter from "./routes/admin";
import shopRouter from "./routes/shop";
import authRouter from "./routes/auth";
import errorController from "./controllers/error.controller";

dotenv.config();
const app = express();
const csrfProtection = csrf();

const MongoDbStore = connectMongoDB(session);
const store = new MongoDbStore({
    uri: process.env.MONGO_URL,
    collection: "sessions",
    databaseName: "shop",
});

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));

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

app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use("/admin", adminRouter);
app.use(shopRouter);
app.use(authRouter);
app.use(errorController.get404);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).redirect("/500");
});

mongoose.connect(process.env.MONGO_URL, { dbName: "shop" }).then((result) => {
    app.listen(3000, () => {
        console.log("Server listen http://localhost:3000");
    });
});
