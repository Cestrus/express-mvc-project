import { ObjectId } from "mongodb";

export type prodCartType = {
    productId: ObjectId;
    quantity: number;
};
