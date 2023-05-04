"use strict";
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
            );
        });
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const productModel_1 = __importDefault(require("../models/productModel"));
const getProducts = (req, res, next) =>
    __awaiter(void 0, void 0, void 0, function* () {
        const products = yield productModel_1.default.findAll();
        res.render("shop/product-list", {
            prods: products,
            pageTitle: "All Products",
            path: "/products",
        });
    });
const getProduct = (req, res, next) =>
    __awaiter(void 0, void 0, void 0, function* () {
        const prodId = req.params.id;
        const product = yield productModel_1.default.findByPk(prodId);
        res.render("shop/product-detail", {
            product: product,
            pageTitle: "Product Detail",
            path: "/products",
        });
    });
const getIndex = (req, res, next) =>
    __awaiter(void 0, void 0, void 0, function* () {
        const products = yield productModel_1.default.findAll();
        res.render("shop/index", {
            prods: products,
            pageTitle: "Shop",
            path: "/",
        });
    });
const getCart = (req, res, next) =>
    __awaiter(void 0, void 0, void 0, function* () {
        const cart = yield req.user.getCart();
        const products = yield cart.getProducts();
        res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Cart",
            products,
            totalPrice: cart.totalPrice,
        });
    });
const postCart = (req, res, next) =>
    __awaiter(void 0, void 0, void 0, function* () {
        const { remove } = req.query;
        const { productId } = req.body;
        const cart = yield req.user.getCart();
        if (remove) {
            // todo remove
        } else {
            const products = yield cart.getProducts({
                where: { id: productId },
            }); //проверяем есть ли такой товар уже в корзине
            let product = products.length > 0 ? products[0] : undefined;
            if (product) {
                // ...
            }
            product = yield productModel_1.default.findByPk(productId);
            cart.addProduct(product, { through: { quantity: 1 } });
        }
        res.redirect("/cart");
    });
const getOrders = (req, res, next) =>
    __awaiter(void 0, void 0, void 0, function* () {
        res.render("shop/orders", {
            path: "/orders",
            pageTitle: "Orders",
        });
    });
const getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout",
    });
};
exports.default = {
    getProducts,
    getProduct,
    getIndex,
    getCart,
    postCart,
    getOrders,
    getCheckout,
};
