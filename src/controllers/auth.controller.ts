import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { FieldValidationError, validationResult } from "express-validator";

import User from "../models/user.model";
import PossibleUser from "../models/possibleUser.model";
import { sendEmail, ENVELOPE } from "../util/sib-api";
import { getToken } from "../util/tokens";

const getLogin = (req: Request, res: Response, next: NextFunction) => {
    const [errorMsg] = req.flash("error");
    const [successMsg] = req.flash("success");
    res.render("auth/login", {
        pageTitle: "Login Page",
        path: "/login",
        flashMsg: { isError: !!errorMsg, message: errorMsg || successMsg },
    });
};

const postLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            req.flash("error", ["Incorrect email or password"]);
            return res.redirect("/login");
        }
        const isValidPass = await bcrypt.compare(password, user.password);
        if (!isValidPass) {
            req.flash("error", ["Incorrect email or password"]);
            return res.redirect("/login");
        }
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save((err) => {
            if (err) {
                console.log(err);
            }
            res.redirect("/");
        });
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};

const postLogout = (req: Request, res: Response, next: NextFunction) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect("/");
    });
};

const getSignup = (req: Request, res: Response, next: NextFunction) => {
    const [errorMsg] = req.flash("error");
    const [successMsg] = req.flash("success");
    const {
        oldEmail = "",
        oldPassword = "",
        oldConfirmPassword = "",
    } = req.session.oldInputValues ? req.session.oldInputValues : {};

    const errorFields = req.session.validationErrorFields
        ? req.session.validationErrorFields
        : [];
    res.render("auth/signup", {
        pageTitle: "Signup Page",
        path: "/signup",
        flashMsg: { isError: !!errorMsg, message: errorMsg || successMsg },
        inputValues: {
            email: oldEmail,
            password: oldPassword,
            confirmPassword: oldConfirmPassword,
        },
        errorFields: errorFields || [],
    });
};

const postSignup = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, confirmPassword } = req.body;
    try {
        const isExistUser = await User.findOne({ email: email });
        const errors = validationResult(req).array() as FieldValidationError[];

        if (errors.length) {
            req.flash(
                "error",
                errors.map((err) => err.msg)
            );
            req.session.oldInputValues = {
                oldEmail: email,
                oldPassword: password,
                oldConfirmPassword: confirmPassword,
            };
            req.session.validationErrorFields = errors.map((err) => err.path);
            return res.status(422).redirect("/signup");
        }
        if (isExistUser) {
            req.flash("error", ["User exist already"]);
            return res.redirect("/signup");
        }

        const isExistPossibleUser = await PossibleUser.findOne({
            email: email,
        });
        if (isExistPossibleUser) {
            await PossibleUser.deleteOne({ email: email });
        }

        const hashPassword = await bcrypt.hash(
            password,
            Number(process.env.SALT)
        );
        const userToken = getToken();
        const possibleUser = new PossibleUser({
            password: hashPassword,
            email,
            userToken,
            expireAt: new Date(),
        });
        possibleUser.save();

        sendEmail(email, ENVELOPE.signUp, userToken);
        req.flash("success", ["Check your mail for confirm sign up"]);
        req.session.oldInputValues = {};
        req.session.validationErrorFields = [];
        res.redirect("/signup");
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};

const getConfirmSignup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { userToken } = req.params;
    try {
        const { password, email } = await PossibleUser.findOneAndDelete({
            userToken: userToken,
        });
        const user = new User({ password, email, cart: { items: [] } });
        user.save();
        sendEmail(email, ENVELOPE.confirmSignup);
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
    res.redirect("/login");
};

const getReset = async (req: Request, res: Response, next: NextFunction) => {
    let [errorMsg] = req.flash("error");
    const [successMsg] = req.flash("success");
    res.render("auth/reset", {
        pageTitle: "Reset password",
        path: "/reset",
        flashMsg: { isError: !!errorMsg, message: errorMsg || successMsg },
    });
};

const postReset = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            req.flash("error", ["Not found e-mail"]);
            return res.redirect("/reset");
        }
        const resetToken = getToken();
        user.resetToken = resetToken;
        user.resetTokenExpiration = new Date(Date.now() + 600000);
        user.save();
        req.flash("success", ["Check your email and confirm reset password"]);
        sendEmail(email, ENVELOPE.changePass, resetToken);
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
    res.redirect("/reset");
};

const getChangePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const [errorMsg] = req.flash("error");
    const [successMsg] = req.flash("success");
    const { resetToken } = req.params;
    try {
        const user = await User.findOne({
            resetToken: resetToken,
            resetTokenExpiration: { $gt: Date.now() },
        });
        if (!user) {
            req.flash("error", ["Invalid Token!"]);
            return res.redirect("/reset");
        }
        req.session.user = user;
        const { oldPassword = "", oldConfirmPassword = "" } = req.session
            .oldInputValues
            ? req.session.oldInputValues
            : {};
        const errorFields = req.session.validationErrorFields
            ? req.session.validationErrorFields
            : [];

        res.render("auth/changePassword", {
            pageTitle: "Change password",
            path: "/changePassword",
            flashMsg: { isError: !!errorMsg, message: errorMsg || successMsg },
            inputValues: {
                password: oldPassword,
                confirmPassword: oldConfirmPassword,
            },
            errorFields: errorFields || [],
        });
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
};

const postChangePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { password, confirmPassword } = req.body;
    const errors = validationResult(req).array() as FieldValidationError[];

    if (errors.length) {
        req.flash(
            "error",
            errors.map((err) => err.msg)
        );
        req.session.oldInputValues = {
            oldPassword: password,
            oldConfirmPassword: confirmPassword,
        };
        req.session.validationErrorFields = errors.map((err) => err.path);
        return res
            .status(422)
            .redirect(`/changePassword/${req.session?.user?.resetToken}`);
    }
    const hashPassword = await bcrypt.hash(password, Number(process.env.SALT));
    try {
        await User.updateOne(
            { email: req.session.user.email },
            { password: hashPassword }
        );
    } catch (err) {
        const error = new Error(err);
        next(error);
    }
    req.flash("success", "Password has change successfuly!");
    req.session.oldInputValues = {};
    req.session.validationErrorFields = [];
    res.redirect(`/changePassword/${req.session?.user?.resetToken}`);
};

export default {
    getLogin,
    postLogin,
    postLogout,
    getSignup,
    postSignup,
    getConfirmSignup,
    getReset,
    postReset,
    getChangePassword,
    postChangePassword,
};
