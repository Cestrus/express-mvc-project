import express from "express";
import adminController from "../controllers/adminController";

const adminRouter = express.Router();

// /admin/add-product => GET
adminRouter.get("/add-product", adminController.getAddProduct);

// /admin/add-product => POST
adminRouter.post("/add-product", adminController.postAddProduct);

// // /admin/edit-product => POST
adminRouter.post("/edit-product/", adminController.postAddProduct);

// // /admin/edit-product => GET
adminRouter.get("/edit-product/:id", adminController.getEditProduct);

adminRouter.post("/delete-product", adminController.postDeleteProduct);

// /admin/products => GET
adminRouter.get("/products", adminController.getProducts);

export default adminRouter;
