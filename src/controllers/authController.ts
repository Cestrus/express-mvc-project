import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";

import User from "../models/userModel";
import PossibleUser from "../models/possibleUserModel";
import { sendEmail, ENVELOPE } from "../util/sib-api";
import { getToken } from "../util/tokens";

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
    // const message = req.flash("signupError")[0];
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

    const isExistPossibleUser = await PossibleUser.findOne({ email: email });
    if (isExistPossibleUser) {
        await PossibleUser.deleteOne({ email: email });
    }
    const hashPassword = await bcrypt.hash(password, Number(process.env.SALT));
    const userToken = getToken();
    const possibleUser = new PossibleUser({
        password: hashPassword,
        email,
        userToken,
        expireAt: new Date(),
    });
    possibleUser.save();

    sendEmail(email, ENVELOPE.signUp, userToken);
    req.flash("confirmSignup", "Check your mail for confirm sign up");
    res.redirect("/signup");
};

const getConfirmSignup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { userToken } = req.params;
    const { password, email } = await PossibleUser.findOneAndDelete({
        userToken: userToken,
    });
    const user = new User({ password, email, cart: { items: [] } });
    user.save();
    sendEmail(email, ENVELOPE.confirmSignup);
    res.redirect("/login");
};

export default {
    getLogin,
    postLogin,
    postLogout,
    getSignup,
    postSignup,
    getConfirmSignup,
};
