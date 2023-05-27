import express from "express";
import { body } from "express-validator";
import validGuard from "../middleware/validator.guard";

import authController from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.get("/login", authController.getLogin);

authRouter.post("/login", authController.postLogin);

authRouter.post("/logout", authController.postLogout);

authRouter.get("/signup", authController.getSignup);

authRouter.post(
    "/signup",
    validGuard.checkEmail("email"),
    validGuard.checkPassword("password"),
    validGuard.confirmPassword("confirmPassword"),
    authController.postSignup
);

authRouter.get("/confirmSignup/:userToken", authController.getConfirmSignup);

authRouter.get("/reset", authController.getReset);

authRouter.post("/reset", authController.postReset);

authRouter.get("/changePassword/:resetToken", authController.getChangePassword);

authRouter.post(
    "/changePassword/",
    validGuard.checkPassword("password"),
    validGuard.confirmPassword("confirmPassword"),
    authController.postChangePassword
);

export default authRouter;
