import { Request, Response, NextFunction } from "express";
import Product from "../models/productModel";
import Cart from "../models/cartModel";

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
    if (!id) {
        await req.user.createProduct({
            title,
            price,
            imageUrl,
            description,
        });
    } else {
        await Product.update(
            { title, price, imageUrl, description },
            { where: { id: id } }
        );
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
    const product = await req.user.getProducts({ where: { id: id } });
    if (!editMode || !product) {
        return res.redirect("/");
    }
    res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/add-product",
        editing: editMode,
        product: product[0],
    });
};

const postDeleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id, price } = req.body;
    await Product.destroy({ where: { id: id } });
    res.redirect(`/admin/products`);
};

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.findAll({ where: { userId: req.user.id } });
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
