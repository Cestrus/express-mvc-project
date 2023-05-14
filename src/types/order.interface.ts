import { ObjectId } from "mongodb";
import { ICart } from "./user.interface";

export interface IOrder {
    _id: ObjectId;
    userId: ObjectId;
    products: ICart;
}
