import path from "path";
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";

import adminRouter from "./routes/admin";
import shopRouter from "./routes/shop";
import errorController from "./controllers/errorController";
import { mongoConnect } from "./util/database";
import { User } from "./models/userModel";

const app = express();
// const dbConnect = mongoConnect();

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));

app.use(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.getUserById("6457ab9dbc365c8076060e98");
    req.user = user;
    next();
});

app.use("/admin", adminRouter);
app.use(shopRouter);

app.use(errorController.get404);

app.listen(3000);
