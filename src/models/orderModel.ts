import { ObjectId } from "mongodb";

import { mongoConnect } from "../util/database";
import { ICart, IUser } from "../types/user.interface";
import { IOrder } from "../types/order.interface";

export class Order {
    constructor(public userId: ObjectId, public products: ICart) {}

    private static async getCollection() {
        const { db, close } = await mongoConnect();
        return {
            collection: db.collection("orders"),
            close,
        };
    }

    public static async addOrder(user: IUser) {
        const { collection, close } = await Order.getCollection();
        await collection.insertOne({
            userId: user._id,
            products: [...user.cart.items],
        });
        await close();
    }

    // remade with aggrigation
    public static async getOrders(userId: ObjectId) {
        const { collection, close } = await Order.getCollection();
        const orders = await collection.find({ userId }).toArray();
        await close();
        return orders;
    }
}
