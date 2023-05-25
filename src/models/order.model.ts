import mongoose from "mongoose";

const Schema = mongoose.Schema;
const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: "Product",
            },
            quantity: { type: Number, required: true },
        },
    ],
});

export default mongoose.model("Order", orderSchema);
