import { Request, Response, NextFunction } from "express";
import Product from "../models/product.model";
import Order from "../models/order.model";

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find();
    res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
    });
};

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    const prodId = req.params.id;
    const product = await Product.findOne({ _id: prodId });
    res.render("shop/product-detail", {
        product: product,
        pageTitle: "Product Detail",
        path: "/products",
    });
};

const getIndex = async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find();
    res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
    });
};

const getCart = async (req: Request, res: Response, next: NextFunction) => {
    await req.user.populate("cart.items.productId"); //
    const products = req.user.cart.items;
    res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Cart",
        products,
        // totalPrice: "None",
    });
};

const postCart = async (req: Request, res: Response, next: NextFunction) => {
    const { remove } = req.query;
    const { productId, price } = req.body;
    if (remove === "true") {
        await req.user.removeProduct(productId);
    } else {
        await req.user.addToCart(productId);
    }
    res.redirect("/cart");
};

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    const orders = (await Order.find({ userId: req.session.user._id })) || [];
    res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Orders",
        orders,
    });
};

const postOrder = async (req: Request, res: Response, next: NextFunction) => {
    const order = new Order({
        userId: req.session.user._id,
        products: [...req.session.user.cart.items],
    });
    order.save();
    req.user.clearCart();
    res.redirect("/orders");
};

export default {
    getProducts,
    getProduct,
    getIndex,
    getCart,
    postCart,
    getOrders,
    postOrder,
};
