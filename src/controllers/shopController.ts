import { Request, Response, NextFunction } from "express";
import { Product } from "../models/productModel";
import { User } from "../models/userModel";
import { IUser, prodCartType } from "../types/user.interface";
import { Order } from "../models/orderModel";
// import { CartModel } from "../models/cartModel";

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.fetchAll();
    res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
    });
};

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    const prodId = req.params.id;
    const product = await Product.fetchOne(prodId);
    res.render("shop/product-detail", {
        product: product,
        pageTitle: "Product Detail",
        path: "/products",
    });
};

const getIndex = async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.fetchAll();
    res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
    });
};

const getCart = async (req: Request, res: Response, next: NextFunction) => {
    const prodIdInCart: prodCartType[] = req.user.cart.items;
    const products = await User.getCart(prodIdInCart);
    res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Cart",
        products,
        totalPrice: "None",
    });
};

const postCart = async (req: Request, res: Response, next: NextFunction) => {
    const { remove } = req.query;
    const { productId, price } = req.body;
    if (remove === "true") {
        await User.removeProduct(productId, Number(price), req.user as IUser);
    } else {
        await User.addToCart(req.user as IUser, productId);
    }
    res.redirect("/cart");
};

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    const orders = await Order.getOrders(req.user._id);
    console.log("===> ", orders);

    res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Orders",
        orders,
    });
};

const postOrder = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser;
    await Order.addOrder(user);
    await User.setEmptyCart(user._id);
    res.redirect("/orders");
};

const getCheckout = (req: Request, res: Response, next: NextFunction) => {
    res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout",
    });
};

export default {
    getProducts,
    getProduct,
    getIndex,
    getCart,
    postCart,
    getOrders,
    postOrder,
    getCheckout,
};
