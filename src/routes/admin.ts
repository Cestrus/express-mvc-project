import express from "express";
import adminController from "../controllers/adminController";
import { authGuard } from "../middleware/authGuard";

const adminRouter = express.Router();

// /admin/add-product => GET
adminRouter.get("/add-product", authGuard, adminController.getAddProduct);

// /admin/add-product => POST
adminRouter.post("/add-product", authGuard, adminController.postAddProduct);

// // /admin/edit-product => POST
adminRouter.post("/edit-product/", authGuard, adminController.postAddProduct);

// // /admin/edit-product => GET
adminRouter.get("/edit-product/:id", authGuard, adminController.getEditProduct);

adminRouter.post(
    "/delete-product",
    authGuard,
    adminController.postDeleteProduct
);

// /admin/products => GET
adminRouter.get("/products", authGuard, adminController.getProducts);

export default adminRouter;
