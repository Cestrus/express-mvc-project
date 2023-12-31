import express from "express";
import adminController from "../controllers/admin.controller";
import validGuard from "../middleware/validator.guard";
import { authGuard } from "../middleware/auth.guard";

const adminRouter = express.Router();

// /admin/add-product => GET
adminRouter.get("/add-product", authGuard, adminController.getAddProduct);

// /admin/add-product => POST
adminRouter.post(
    "/add-product",
    authGuard,
    validGuard.checkURL("imageUrl"),
    validGuard.checkNumeric("price"),
    validGuard.checkText("title"),
    validGuard.checkText("description"),
    adminController.postAddProduct
);

// // /admin/edit-product => POST
adminRouter.post(
    "/edit-product/",
    authGuard,
    validGuard.checkURL("imageUrl"),
    validGuard.checkNumeric("price"),
    validGuard.checkText("title"),
    validGuard.checkText("description"),
    adminController.postAddProduct
);

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
