import { DataTypes } from "sequelize";
import sequelize from "../util/database";

const Order = sequelize.define("order", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
    },
});

export default Order;
