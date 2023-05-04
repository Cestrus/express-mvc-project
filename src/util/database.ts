import { Sequelize } from "sequelize";

const sequelize = new Sequelize("node_course", "root", "qweqwe", {
    dialect: "mysql",
    host: "localhost",
});

export default sequelize;
