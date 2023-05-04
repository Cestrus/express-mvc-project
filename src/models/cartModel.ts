import { DataTypes } from "sequelize";
import sequelize from "../util/database";

const Cart = sequelize.define("cart", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
    },
});

export default Cart;
