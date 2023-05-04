"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const database_1 = __importDefault(require("./util/database"));
const admin_1 = __importDefault(require("./routes/admin"));
const shop_1 = __importDefault(require("./routes/shop"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const productModel_1 = __importDefault(require("./models/productModel"));
const userModel_1 = __importDefault(require("./models/userModel"));
const cartModel_1 = __importDefault(require("./models/cartModel"));
const cartItemModel_1 = __importDefault(require("./models/cartItemModel"));
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.set("views", "src/views");
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use((req, res, next) => {
    userModel_1.default.findByPk(1)
        .then((user) => {
        req.user = user;
        next();
    })
        .catch((err) => {
        console.log(err);
    });
});
app.use("/admin", admin_1.default);
app.use(shop_1.default);
app.use(errorController_1.default.get404);
productModel_1.default.belongsTo(userModel_1.default, { constraints: true, onDelete: "CASCADE" });
userModel_1.default.hasMany(productModel_1.default);
userModel_1.default.hasOne(cartModel_1.default);
cartModel_1.default.belongsTo(userModel_1.default);
cartModel_1.default.belongsToMany(productModel_1.default, { through: cartItemModel_1.default });
productModel_1.default.belongsToMany(cartModel_1.default, { through: cartItemModel_1.default });
database_1.default
    .sync()
    .then(() => {
    return userModel_1.default.findByPk(1);
})
    .then((user) => {
    if (!user) {
        return userModel_1.default.create({
            email: "qwe@qwe.qw",
            passwordHash: "qweqwe",
        }).then((user) => {
            user.createCart();
            return user;
        });
    }
    else {
        return user;
    }
})
    .then((result) => {
    app.listen(3000);
})
    .catch((err) => console.log(err));
