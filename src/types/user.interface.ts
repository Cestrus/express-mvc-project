import { ObjectId } from "mongodb";

export type prodCartType = {
    id: string;
    quantity: number;
};

export interface ICart {
    items: prodCartType[];
}

export interface IUser {
    _id?: ObjectId;
    userName: string;
    email: string;
    cart: ICart;
}
