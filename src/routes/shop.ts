import express from "express";
import shopController from "../controllers/shop.controller";
import { authGuard } from "../middleware/auth.guard";

const shopRouter = express.Router();

shopRouter.get("/", shopController.getIndex);

shopRouter.get("/products", shopController.getProducts);

shopRouter.get("/product/:id", shopController.getProduct);

shopRouter.get("/cart", authGuard, shopController.getCart);

shopRouter.post("/cart", authGuard, shopController.postCart);

shopRouter.post("/cart/remove-product", authGuard, shopController.postCart);

shopRouter.get("/orders", authGuard, shopController.getOrders);

shopRouter.get("/orders/:orderId", authGuard, shopController.getInvoice);

shopRouter.post("/order-items", authGuard, shopController.postOrder);

// shopRouter.get("/checkout", shopController.getCheckout);

export default shopRouter;
