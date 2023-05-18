import mongoose, { mongo } from "mongoose";
import { prodCartType } from "../types/prodCart";

const Schema = mongoose.Schema;
const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: "Product",
                },
                quantity: { type: Number, required: true },
            },
        ],
    },
});

userSchema.methods.addToCart = async function (id: string) {
    const products = [...this.cart.items];
    const existProduct = products.find(
        (prod) => prod.productId.toString() === id && prod
    );
    if (existProduct) {
        existProduct.quantity += 1;
    } else {
        products.push({ productId: id, quantity: 1 });
    }
    this.cart.items = products;
    return this.save();
};

userSchema.methods.removeProduct = async function (prodId: string) {
    let products = [...this.cart.items];
    const product = products.find(
        (prod: prodCartType) => prod.productId.toString() === prodId
    );
    if (!product) {
        return;
    }
    product.quantity -= 1;
    if (product.quantity <= 0) {
        products = products.filter((prod: prodCartType) => prod.quantity > 0);
    }
    this.cart.items = products;
    this.save();
};

userSchema.methods.clearCart = async function () {
    this.cart.items = [];
    this.save();
};

export default mongoose.model("User", userSchema);
