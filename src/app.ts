import path from "path";
import express, { NextFunction, Response, Request } from "express";
import bodyParser from "body-parser";
import { Sequelize } from "sequelize";

import sequelize from "./util/database";
import adminRouter from "./routes/admin";
import shopRouter from "./routes/shop";
import errorController from "./controllers/errorController";

import Product from "./models/productModel";
import User from "./models/userModel";
import Cart from "./models/cartModel";
import CartItem from "./models/cartItemModel";
import Order from "./models/orderModel";
import OrderItem from "./models/orderItemModel";

const app = express();

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));

app.use((req: Request, res: Response, next: NextFunction) => {
    User.findByPk(1)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => {
            console.log(err);
        });
});

app.use("/admin", adminRouter);
app.use(shopRouter);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, { through: OrderItem });

sequelize
    // .sync({ force: true })
    .sync()
    .then(() => {
        return User.findByPk(1);
    })
    .then((user) => {
        if (!user) {
            return User.create({
                email: "qwe@qwe.qw",
                passwordHash: "qweqwe",
            }).then((user) => {
                (user as Sequelize.TypeModel).createCart();
                return user;
            });
        } else {
            return user;
        }
    })
    .then((result) => {
        app.listen(3000);
    })
    .catch((err) => console.log(err));
