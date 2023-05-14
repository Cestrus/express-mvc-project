import { Request, Response, NextFunction } from "express";
import { Product } from "../models/productModel";
// import { CartModel } from "../models/cartModel";

const getAddProduct = (req: Request, res: Response, next: NextFunction) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
    });
};

const postAddProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id, title, price, imageUrl, description } = req.body;
    const product = new Product(
        title,
        Number(price),
        description,
        imageUrl,
        req.user._id
    );
    if (id) {
        await product.update(id);
    } else {
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
    const product = await Product.fetchOne(id);
    if (!editMode || !product) {
        return res.redirect("/");
    }
    res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/add-product",
        editing: editMode,
        product,
    });
};

const postDeleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id, price } = req.body;
    await Product.removeProduct(id);
    res.redirect("/admin/products");
};

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.fetchAll();
    res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
    });
};

export default {
    getAddProduct,
    postAddProduct,
    getEditProduct,
    getProducts,
    postDeleteProduct,
};
