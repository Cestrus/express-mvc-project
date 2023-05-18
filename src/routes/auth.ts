import express from "express";
import authController from "../controllers/authController";

const authRouter = express.Router();

authRouter.get("/login", authController.getLogin);

authRouter.post("/login", authController.postLogin);

authRouter.get("/logout", authController.getLogout);

export default authRouter;
