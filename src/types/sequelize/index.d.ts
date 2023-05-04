import { Model, Sequelize } from "sequelize";

declare global {
    namespace Sequelize {
        interface TypeModel extends Model {
            createCart?: () => Promise<any>;
        }
    }
}
