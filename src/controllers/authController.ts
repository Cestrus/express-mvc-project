import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import User from "../models/userModel";
import { mailer, mailConstructor } from "../util/mailer";

const getLogin = (req: Request, res: Response, next: NextFunction) => {
    const message = req.flash("errorLogin")[0];
    res.render("auth/login", {
        pageTitle: "Login Page",
        path: "/login",
        errorMsg: message,
    });
};

const postLogout = (req: Request, res: Response, next: NextFunction) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
    });
};

const postLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        req.flash("errorLogin", "Incorrect email or password");
        return res.redirect("/login");
    }
    const isValidPass = await bcrypt.compare(password, user.password);
    if (!isValidPass) {
        req.flash("errorLogin", "Incorrect email or password");
        return res.redirect("/login");
    }
    req.session.isLoggedIn = true;
    req.session.user = user;

    req.session.save((err) => {
        console.log(err);
        res.redirect("/");
    });
};

const getSignup = (req: Request, res: Response, next: NextFunction) => {
    const [messErr, isError] = req.flash("signupError");
    const [messConfirm] = req.flash("confirmSignup");
    res.render("auth/signup", {
        pageTitle: "Signup Page",
        path: "/signup",
        messObj: { isError, message: messErr || messConfirm },
    });
};

const postSignup = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, confirmPassword } = req.body;
    const isExistUser = await User.findOne({ email: email });
    if (isExistUser) {
        req.flash("signupError", ["User exist already", "error"]);
        return res.redirect("/signup");
    }
    const hashPassword = await bcrypt.hash(password, Number(process.env.SALT));
    const user = new User({
        password: hashPassword,
        email,
        cart: { items: [] },
    });
    user.save();
    const mail = mailConstructor(email, password);
    mailer(mail);
    req.flash("confirmSignup", "Check your mail for confirm sign up");
    res.redirect("/signup");
};

const getConfirm = (req: Request, res: Response, next: NextFunction) => {
    res.redirect("/login");
};

const getReset = async (req: Request, res: Response, next: NextFunction) => {
    res.render("auth/reset", {
        pageTitle: "Reset password",
        path: "/reset",
    });
};

const postReset = async (req: Request, res: Response, next: NextFunction) => {};

export default {
    getLogin,
    postLogin,
    postLogout,
    getSignup,
    postSignup,
    getConfirm,
    getReset,
    postReset,
};
