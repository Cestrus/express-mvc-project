"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shopController_1 = __importDefault(require("../controllers/shopController"));
const shopRouter = express_1.default.Router();
shopRouter.get("/", shopController_1.default.getIndex);
shopRouter.get("/products", shopController_1.default.getProducts);
shopRouter.get("/product/:id", shopController_1.default.getProduct);
shopRouter.get("/cart", shopController_1.default.getCart);
shopRouter.post("/cart", shopController_1.default.postCart);
shopRouter.post("/cart/remove-product", shopController_1.default.postCart);
shopRouter.get("/orders", shopController_1.default.getOrders);
shopRouter.get("/checkout", shopController_1.default.getCheckout);
exports.default = shopRouter;
