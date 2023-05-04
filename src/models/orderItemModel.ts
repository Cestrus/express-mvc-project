import { DataTypes } from "sequelize";
import sequelize from "../util/database";

const OrderItem = sequelize.define("orderItem", {
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

export default OrderItem;
