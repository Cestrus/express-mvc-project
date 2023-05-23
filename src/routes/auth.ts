import express from "express";
import authController from "../controllers/authController";

const authRouter = express.Router();

authRouter.get("/login", authController.getLogin);

authRouter.post("/login", authController.postLogin);

authRouter.post("/logout", authController.postLogout);

authRouter.get("/signup", authController.getSignup);

authRouter.post("/signup", authController.postSignup);

authRouter.get("/confirm", authController.getConfirm);

authRouter.get("/reset", authController.getReset);

authRouter.post("/reset", authController.postReset);

export default authRouter;
