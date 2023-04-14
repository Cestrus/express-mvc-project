import path from "path";
import rootPath from "../util/path";
import fs from "fs";
import { CartProductType } from "./cartModel";

export type ProductForCartType = { product: Product; quantity: number };

const filePath = path.join(rootPath, "data", "products.json");

export const getProductsFromFile = async <T extends (K: any) => any>(
    callback?: T
): Promise<Product[]> => {
    const result = new Promise<Product[]>((res, rej) => {
        let products: Product[] = [];
        fs.readFile(filePath, (err, fileContent) => {
            if (!err) {
                products = JSON.parse(fileContent.toString());
                if (callback) {
                    res(callback(products));
                }
            }
            res(products);
        });
    });
    return await result;
};

export class Product {
    id: string;

    constructor(
        id: string,
        public title: string,
        public price: number,
        public description: string,
        public imageUrl: string
    ) {
        this.id = id ? id : Math.random().toString();
    }

    async save(id: string | undefined): Promise<void> {
        const products = await Product.fetchAll();
        if (id) {
            const idx = products.findIndex((el) => el.id === this.id);
            products.splice(idx, 1, this);
        } else {
            products.push(this);
        }
        fs.writeFile(filePath, JSON.stringify(products), (err) => {
            console.log("error ", err);
        });
    }

    static async fetchAll(): Promise<Product[]> {
        return await getProductsFromFile();
    }

    static async getProductById(id: string) {
        return await getProductsFromFile((products: Product[]) => {
            return products.find((product: Product) => product.id === id);
        });
    }

    static async getProductsForCart(
        cartProducts: CartProductType[]
    ): Promise<ProductForCartType[]> {
        const products: { product: Product; quantity: number }[] = [];
        const allProducts = await this.fetchAll();
        allProducts.forEach((prod) => {
            cartProducts.forEach((cartProduct) => {
                if (cartProduct.id === prod.id) {
                    products.push({
                        product: prod,
                        quantity: cartProduct.quantity,
                    });
                }
            });
        });
        return products;
    }

    static async removeProduct(id: string) {
        const productsList = await this.fetchAll();
        const newProductsList = productsList.filter((prod) => prod.id !== id);
        fs.writeFile(filePath, JSON.stringify(newProductsList), (err) => {
            console.log("error ", err);
        });
    }
}
