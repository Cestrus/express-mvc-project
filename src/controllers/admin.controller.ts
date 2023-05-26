import { Request, Response, NextFunction } from "express";
import { FieldValidationError, validationResult } from "express-validator";

import Product from "../models/product.model";

const getAddProduct = (req: Request, res: Response, next: NextFunction) => {
    const [errorMsg] = req.flash("error");
    const [successMsg] = req.flash("success");
    const {
        oldTitle = "",
        oldPrice = "",
        oldImageUrl = "",
        oldDescription = "",
    } = req.session.oldInputValues ? req.session.oldInputValues : {};
    const errorFields = req.session.validationErrorFields
        ? req.session.validationErrorFields
        : [];

    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        flashMsg: { isError: !!errorMsg, message: errorMsg || successMsg },
        inputValues: {
            title: oldTitle,
            price: oldPrice,
            imageUrl: oldImageUrl,
            description: oldDescription,
        },
        errorFields: errorFields || [],
    });
};

const getEditProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const [errorMsg] = req.flash("error");
    const [successMsg] = req.flash("success");
    const {
        oldTitle = "",
        oldPrice = "",
        oldImageUrl = "",
        oldDescription = "",
    } = req.session.oldInputValues ? req.session.oldInputValues : {};
    console.log(" get ==> ", oldTitle, oldPrice, oldImageUrl, oldDescription);
    const errorFields = req.session.validationErrorFields
        ? req.session.validationErrorFields
        : [];

    const { editMode } = req.query;
    const { id } = req.params;
    const product = await Product.findOne({ _id: id });
    if (!editMode || !product) {
        return res.redirect("/");
    }
    res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/add-product",
        editing: editMode,
        flashMsg: { isError: !!errorMsg, message: errorMsg || successMsg },
        prodId: product._id,
        inputValues: {
            title: oldTitle || product.title,
            price: oldPrice || product.price,
            imageUrl: oldImageUrl || product.imageUrl,
            description: oldDescription || product.description,
        },
        errorFields: errorFields || [],
    });
};

const postAddProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id, title, price, imageUrl, description } = req.body;
    console.log("post ==> ", title, price, imageUrl, description);
    const errors = validationResult(req).array() as FieldValidationError[];

    if (errors.length) {
        req.flash(
            "error",
            errors.map((err) => err.msg)
        );
        req.session.oldInputValues = {
            oldTitle: title,
            oldPrice: price,
            oldImageUrl: imageUrl,
            oldDescription: description,
        };
        req.session.validationErrorFields = errors.map((err) => err.path);
        return res
            .status(422)
            .redirect(`/admin/edit-product/${id}?editMode=true`);
    }
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
    req.session.oldInputValues = {};
    req.session.validationErrorFields = [];
    res.redirect("/admin/products");
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
    const products = await Product.find({ userId: req.session.user._id });
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
