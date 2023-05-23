import mongoose from "mongoose";

const Schema = mongoose.Schema;
const possibleUserSchema = new Schema({
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    userToken: {
        type: String,
        required: true,
    },
    expireAt: {
        type: Date,
        expires: 24 * 60 * 60,
    },
});

export default mongoose.model("PossibleUser", possibleUserSchema);
