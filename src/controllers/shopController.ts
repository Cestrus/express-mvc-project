import { Request, Response, NextFunction } from "express";
import { Product, ProductForCartType } from "../models/productModel";
import { CartModel } from "../models/cartModel";

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
    const product = await Product.getProductById(prodId);
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
    const cart = await CartModel.getCart();
    let productsData: ProductForCartType[] = [];
    if (cart.products.length) {
        productsData = await Product.getProductsForCart(cart.products);
    }
    res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Cart",
        productsData,
        totalPrice: cart.totalPrice,
    });
};

const postCart = async (req: Request, res: Response, next: NextFunction) => {
    const { remove } = req.query;
    const { id, price } = req.body;
    const cart = await CartModel.getCart();
    if (remove) {
        cart.removeProduct(id, Number(price));
    } else {
        cart.addProduct(id, Number(price));
    }
    res.redirect("/cart");
};

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Orders",
    });
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
    getCheckout,
};
