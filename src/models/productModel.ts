import { ObjectId } from "mongodb";
import { mongoConnect } from "../util/database";

export class Product {
    constructor(
        public title: string,
        public price: number,
        public description: string,
        public imageUrl: string,
        public userId: string
    ) {}

    private static async getCollection() {
        const { db, close } = await mongoConnect();
        return {
            collection: db.collection("products"),
            close,
        };
    }

    async save() {
        const { collection, close } = await Product.getCollection();
        const result = await collection.insertOne(this);
        await close();
    }

    static async fetchAll() {
        const { collection, close } = await Product.getCollection();
        const mongoProducts = await collection.find({}).toArray();
        await close();
        return mongoProducts;
    }

    static async fetchOne(id: string) {
        const { collection, close } = await Product.getCollection();
        const product = await collection.findOne({ _id: new ObjectId(id) });
        await close();
        return product;
    }

    static async fetchProducts(prodIdArr: string[]) {
        if (!prodIdArr.length) {
            return [];
        }
        const formatArr = prodIdArr.map((prodId) => new ObjectId(prodId));
        const { collection, close } = await Product.getCollection();
        const products = await collection
            .find({ _id: { $in: [...formatArr] } })
            .toArray();
        await close();
        return products;
    }

    static async removeProduct(id: string) {
        const { collection, close } = await Product.getCollection();
        await collection.deleteOne({ _id: new ObjectId(id) });
        await close();
    }

    async update(id: string) {
        const { collection, close } = await Product.getCollection();
        await collection.updateOne({ _id: new ObjectId(id) }, { $set: this });
        await close();
    }
}
