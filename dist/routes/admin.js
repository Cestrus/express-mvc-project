"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = __importDefault(require("../controllers/adminController"));
const adminRouter = express_1.default.Router();
// /admin/add-product => GET
adminRouter.get("/add-product", adminController_1.default.getAddProduct);
// /admin/add-product => POST
adminRouter.post("/add-product", adminController_1.default.postAddProduct);
// /admin/edit-product => POST
adminRouter.post("/edit-product/", adminController_1.default.postAddProduct);
// /admin/edit-product => GET
adminRouter.get("/edit-product/:id", adminController_1.default.getEditProduct);
adminRouter.post("/delete-product", adminController_1.default.postDeleteProduct);
// /admin/products => GET
adminRouter.get("/products", adminController_1.default.getProducts);
exports.default = adminRouter;
