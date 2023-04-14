import path from "path";
import rootPath from "../util/path";
import fs from "fs";

const filePath = path.join(rootPath, "data", "cart.json");

export type CartProductType = {
    id: string;
    price: number;
    quantity: number;
};

export interface ICart {
    products: CartProductType[];
    totalPrice: number;
}

const getCartFromFile = async (): Promise<ICart> => {
    const result = new Promise<ICart>((res, rej) => {
        let cart: ICart = { products: [], totalPrice: 0 };
        fs.readFile(filePath, (err, fileContent) => {
            if (!err) {
                cart = JSON.parse(fileContent.toString());
            }
            res(cart);
        });
    });
    return await result;
};

export class CartModel {
    private _products: CartProductType[];
    private _totalPrice: number;
    private static instance: CartModel;

    private constructor() {}

    static async getCart() {
        if (!CartModel.instance) {
            const cart = await getCartFromFile();
            CartModel.instance = new CartModel();
            CartModel.instance._products = cart.products;
            CartModel.instance._totalPrice = cart.totalPrice;
        }
        return CartModel.instance;
    }

    get products() {
        return this._products;
    }

    get totalPrice() {
        return this._totalPrice;
    }

    async addProduct(id: string, price: number) {
        const existProductIdx = this.products.findIndex(
            (prod) => prod.id === id
        );
        if (existProductIdx >= 0) {
            this.products[existProductIdx].quantity++;
        } else {
            this.products.push({ id, price, quantity: 1 });
        }
        this._totalPrice += price;
        await this.saveCart();
    }

    private async saveCart() {
        fs.writeFile(
            filePath,
            JSON.stringify({
                products: this.products,
                totalPrice: this.totalPrice,
            }),
            (err) => {
                console.log(err);
            }
        );
    }

    async removeProduct(id: string, price: number) {
        const productIdx = this.products.findIndex((prod) => prod.id === id);
        if (productIdx >= 0) {
            this.products[productIdx].quantity -= 1;
            if (this.products[productIdx].quantity <= 0) {
                this.products.splice(productIdx, 1);
            }
            this._totalPrice -= price;
            await this.saveCart();
        }
    }
}
