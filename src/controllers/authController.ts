import { Request, Response, NextFunction } from "express";

import User from "../models/userModel";

const getLogin = (req: Request, res: Response, next: NextFunction) => {
    res.render("auth/login", {
        pageTitle: "Login Page",
        path: "/login",
        isAuthenticated: false,
    });
};

const getLogout = (req: Request, res: Response, next: NextFunction) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
    });
};

const postLogin = async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById("64632efaee5499fe9d763e00");
    if (user) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save((err) => {
            console.log(err);
            res.redirect("/");
        });
    }
};

export default {
    getLogin,
    postLogin,
    getLogout,
};
