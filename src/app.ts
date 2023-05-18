import path from "path";
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import session from "express-session";
import connectMongoDB from "connect-mongodb-session";

import User from "./models/userModel";
import adminRouter from "./routes/admin";
import shopRouter from "./routes/shop";
import errorController from "./controllers/errorController";

import authRouter from "./routes/auth";

dotenv.config();
const app = express();

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

app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user) {
        next();
    } else {
        const user = await User.findById(req.session.user._id);
        req.user = user;
        next();
    }
});

app.use("/admin", adminRouter);
app.use(shopRouter);
app.use(authRouter);
app.use(errorController.get404);

mongoose.connect(process.env.MONGO_URL, { dbName: "shop" }).then((result) => {
    // const user = new User({
    //     userName: "Alex",
    //     email: "alex@mail.qw",
    //     cart: { items: [] },
    // });
    // user.save();
    app.listen(3000);
});
