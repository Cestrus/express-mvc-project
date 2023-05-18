import { Request, Response, NextFunction } from "express";
import Product from "../models/productModel";

const getAddProduct = (req: Request, res: Response, next: NextFunction) => {
    const isLoggedIn = req.session.isLoggedIn;
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        isAuthenticated: isLoggedIn,
    });
};

const postAddProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id, title, price, imageUrl, description } = req.body;
    if (id) {
        await Product.updateOne(
            { _id: id },
            { title, price: Number(price), imageUrl, description }
        );
    } else {
        const product = new Product({
            userId: req.session.user._id,
            title,
            price: Number(price),
            description,
            imageUrl,
        });
        await product.save();
    }
    res.redirect("/admin/products");
};

const getEditProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { editMode } = req.query;
    const { id } = req.params;
    const product = await Product.findOne({ _id: id });
    if (!editMode || !product) {
        return res.redirect("/");
    }
    const isLoggedIn = req.session.isLoggedIn;
    res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/add-product",
        editing: editMode,
        product,
        isAuthenticated: isLoggedIn,
    });
};

const postDeleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id, price } = req.body;
    await Product.deleteOne({ _id: id });
    res.redirect("/admin/products");
};

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find();
    const isLoggedIn = req.session.isLoggedIn;
    res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: isLoggedIn,
    });
};

export default {
    getAddProduct,
    postAddProduct,
    getEditProduct,
    getProducts,
    postDeleteProduct,
};
