import { Request, Response, NextFunction } from "express";
import { createReadStream, createWriteStream } from "node:fs";
import PDFDocument from "pdfkit";
import path from "node:path";

import Product from "../models/product.model";
import Order from "../models/order.model";
import { Schema } from "mongoose";

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Product.find();

        res.render("shop/product-list", {
            prods: products,
            pageTitle: "All Products",
            path: "/products",
        });
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    const prodId = req.params.id;
    try {
        const product = await Product.findOne({ _id: prodId });

        res.render("shop/product-detail", {
            product: product,
            pageTitle: "Product Detail",
            path: "/products",
        });
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};

const getIndex = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Product.find();
        res.render("shop/index", {
            prods: products,
            pageTitle: "Shop",
            path: "/",
        });
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};

const getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await req.user.populate("cart.items.productId"); //
        const products = req.user.cart.items;
        res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Cart",
            products,
            // totalPrice: "None",
        });
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};

const postCart = async (req: Request, res: Response, next: NextFunction) => {
    const { remove } = req.query;
    const { productId, price } = req.body;
    try {
        if (remove === "true") {
            await req.user.removeProduct(productId);
        } else {
            await req.user.addToCart(productId);
        }
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
    res.redirect("/cart");
};

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders =
            (await Order.find({ userId: req.session.user._id }).populate(
                "products.productId"
            )) || [];
        res.render("shop/orders", {
            path: "/orders",
            pageTitle: "Orders",
            orders,
        });
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};

const postOrder = async (req: Request, res: Response, next: NextFunction) => {
    const order = new Order({
        userId: req.user._id,
        products: [...req.user.cart.items],
    });
    try {
        order.save();
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
    req.user.clearCart();
    res.redirect("/orders");
};

const getInvoice = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId;
    const invoiceName = `invoice-${orderId}.pdf`;
    try {
        const order = await Order.findById(orderId).populate(
            "products.productId"
        );
        if (!order) {
            const error = new Error("Not found order");
            return next(error);
        }
        if (order.userId.toString() !== req.user._id.toString()) {
            const error = new Error("Not authorized");
            return next(error);
        }
        const invoicePath = path.join("src", "data", "invoices", invoiceName);
        // create pdf-doc
        const doc = new PDFDocument();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `inline; filename="${invoiceName}" `
        );
        doc.pipe(createWriteStream(invoicePath));
        doc.pipe(res);
        doc.fontSize(22).font("Courier-Bold").text(`Invoice #${orderId}`);
        doc.fontSize(16).text(
            "------------------------------------------------"
        );

        order.products.forEach((prod: any) => {
            doc.font("Courier").text(
                `Product: ${prod.productId.title}, price: ${prod.productId.price}, quantity: ${prod.quantity}`
            );
        });
        doc.text("------------------------------------------------");
        doc.fontSize(18)
            .font("Courier-Bold")
            .text(
                `Total price: $${order.products.reduce(
                    (acc: number, curr: any) => {
                        return acc + curr.productId.price * curr.quantity;
                    },
                    0
                )}`
            );
        doc.end();
    } catch (err) {
        const error = new Error(err);
        return next(error);
    }
};

export default {
    getProducts,
    getProduct,
    getIndex,
    getCart,
    postCart,
    getOrders,
    postOrder,
    getInvoice,
};
