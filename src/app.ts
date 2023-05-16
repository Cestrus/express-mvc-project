import path from "path";
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

import adminRouter from "./routes/admin";
import shopRouter from "./routes/shop";
import errorController from "./controllers/errorController";
import User from "./models/userModel";

dotenv.config();
const app = express();

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));

app.use(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById("64632efaee5499fe9d763e00");
    req.user = user;
    next();
});

app.use("/admin", adminRouter);
app.use(shopRouter);
app.use(errorController.get404);

mongoose.connect(process.env.URL, { dbName: "shop" }).then((result) => {
    // const user = new User({
    //     userName: "Alex",
    //     email: "alex@mail.qw",
    //     cart: { items: [] },
    // });
    // user.save();
    app.listen(3000);
});
