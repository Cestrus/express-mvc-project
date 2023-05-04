import { Request, Response, NextFunction } from "express";
import Product from "../models/productModel";
import Cart from "../models/cartModel";
import CartItem from "../models/cartItemModel";

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.findAll();
    res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
    });
};

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    const prodId = req.params.id;
    const product = await Product.findByPk(prodId);
    res.render("shop/product-detail", {
        product: product,
        pageTitle: "Product Detail",
        path: "/products",
    });
};

const getIndex = async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.findAll();
    res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
    });
};

const getCart = async (req: Request, res: Response, next: NextFunction) => {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    const prodData = products.map((prod) => {
        return { ...prod.dataValues, quantity: prod.cartItem.quantity };
    });
    res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Cart",
        products: prodData,
        totalPrice: prodData.reduce((acc, curr) => {
            return (acc += curr.price * curr.quantity);
        }, 0),
    });
};

const postCart = async (req: Request, res: Response, next: NextFunction) => {
    const { remove } = req.query;
    const { productId } = req.body;
    const cart = await req.user.getCart();
    const products = await cart.getProducts({ where: { id: productId } }); //проверяем есть ли такой товар уже в корзине
    let product = products.length > 0 ? products[0] : undefined;
    if (product) {
        const quantity = remove
            ? --product.cartItem.quantity
            : ++product.cartItem.quantity;
        if (quantity <= 0) {
            await CartItem.destroy({
                where: {
                    productId: productId,
                    cartId: product.cartItem.cartId,
                },
            });
        } else {
            await cart.addProduct(product, {
                through: { quantity },
            });
        }
    } else {
        product = await Product.findByPk(productId);
        await cart.addProduct(product, { through: { quantity: 1 } });
    }

    res.redirect("/cart");
};

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    const orders = await req.user.getOrders({ include: ["products"] });
    console.log("===> ", orders[0]);
    res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Orders",
        orders,
    });
};

const postOrders = async (req: Request, res: Response, next: NextFunction) => {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    const order = await req.user.createOrder();
    await order.addProducts(
        products.map((product) => {
            product.orderItem = {
                quantity: product.cartItem.quantity,
            };
            return product;
        })
    );
    await cart.setProducts(null);
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
    postOrders,
    getCheckout,
};
