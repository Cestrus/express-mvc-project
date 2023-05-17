import { Request, Response, NextFunction } from "express";

const getLogin = (req: Request, res: Response, next: NextFunction) => {
    res.render("auth/login", {
        pageTitle: "Login Page",
        path: "/login",
    });
};

export default {
    getLogin,
};
