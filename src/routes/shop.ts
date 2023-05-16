import express from "express";
import shopController from "../controllers/shopController";

const shopRouter = express.Router();

shopRouter.get("/", shopController.getIndex);

shopRouter.get("/products", shopController.getProducts);

shopRouter.get("/product/:id", shopController.getProduct);

shopRouter.get("/cart", shopController.getCart);

shopRouter.post("/cart", shopController.postCart);

shopRouter.post("/cart/remove-product", shopController.postCart);

shopRouter.get("/orders", shopController.getOrders);

shopRouter.post("/order-items", shopController.postOrder);

// shopRouter.get("/checkout", shopController.getCheckout);

export default shopRouter;
