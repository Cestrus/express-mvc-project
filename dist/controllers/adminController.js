"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productModel_1 = __importDefault(require("../models/productModel"));
const getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
    });
};
const postAddProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, title, price, imageUrl, description } = req.body;
    if (!id) {
        yield req.user.createProduct({
            title,
            price,
            imageUrl,
            description,
        });
    }
    else {
        yield productModel_1.default.update({ title, price, imageUrl, description }, { where: { id: id } });
    }
    res.redirect("/admin/products");
});
const getEditProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { editMode } = req.query;
    const { id } = req.params;
    const product = yield req.user.getProducts({ where: { id: id } });
    if (!editMode || !product) {
        return res.redirect("/");
    }
    res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/add-product",
        editing: editMode,
        product: product[0],
    });
});
const postDeleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, price } = req.body;
    // await Product.destroy({ where: { id: id } });
    yield req.user.destroyProduct({ where: { id: id } });
    res.redirect(`/admin/products`);
});
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.findAll({ where: { userId: req.user.id } });
    res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
    });
});
exports.default = {
    getAddProduct,
    postAddProduct,
    getEditProduct,
    getProducts,
    postDeleteProduct,
};
