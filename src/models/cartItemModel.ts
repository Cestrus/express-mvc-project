import { DataTypes } from "sequelize";
import sequelize from "../util/database";

const CartItem = sequelize.define("cartItem", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
    },
});

export default CartItem;
