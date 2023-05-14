import { ObjectId } from "mongodb";

import { Product } from "./productModel";
import { mongoConnect } from "../util/database";
import { ICart, IUser, prodCartType } from "../types/user.interface";

export class User implements IUser {
    constructor(
        public userName: string,
        public email: string,
        public cart: ICart = { items: [] }
    ) {}

    private static async getCollection() {
        const { db, close } = await mongoConnect();
        return {
            collection: db.collection("users"),
            close,
        };
    }

    public async save() {
        const { collection, close } = await User.getCollection();
        await collection.insertOne(this);
        await close();
    }

    public static async getUserById(id: string) {
        const { collection, close } = await User.getCollection();
        const user = await collection.findOne({ _id: new ObjectId(id) });
        await close();
        return user;
    }

    public static async addToCart(userData: IUser, id: string) {
        const { collection, close } = await User.getCollection();
        const products = [...userData.cart.items];
        const product = products.find((prod) => prod.id === id && prod);
        if (product) {
            product.quantity += 1;
        } else {
            products.push({ id: id, quantity: 1 });
        }
        collection.updateOne(
            { _id: userData._id },
            { $set: { cart: { items: products } } }
        );
    }

    // remade with using aggregate
    public static async getCart(cart: prodCartType[]) {
        const prodIdArr = cart.map((prod) => prod.id);
        const products = await Product.fetchProducts(prodIdArr);
        products.forEach((prod) => {
            return cart.forEach((el) => {
                if (el.id === prod._id.toString()) {
                    prod.quantity = el.quantity;
                }
            });
        });
        return products;
    }

    public static async removeProduct(
        prodId: string,
        price: number,
        user: IUser
    ) {
        const { collection, close } = await User.getCollection();
        let items = [...user.cart.items];
        const product = items.find((prod) => prod.id.toString() === prodId);
        if (!product) {
            return;
        }
        product.quantity -= 1;
        if (product.quantity <= 0) {
            items = items.filter((prod) => prod.quantity > 0);
        }

        await collection.updateOne(
            { _id: user._id },
            { $set: { cart: { items: items } } }
        );

        await close();
    }

    public static async setEmptyCart(userId: ObjectId) {
        const { collection, close } = await User.getCollection();
        await collection.updateOne(
            { _id: userId },
            { $set: { cart: { items: [] } } }
        );
        await close();
    }
}
