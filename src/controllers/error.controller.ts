import { Request, Response, NextFunction } from "express";

const get404 = (req: Request, res: Response, next: NextFunction) => {
    const isLoggedIn = req.session.isLoggedIn;
    res.status(404).render("404", {
        pageTitle: "Page Not Found",
        path: "/404",
        isAuthenticated: isLoggedIn,
    });
};

const get500 = (req: Request, res: Response, next: NextFunction) => {
    const isLoggedIn = req.session.isLoggedIn;
    res.status(500).render("500", {
        pageTitle: "Error",
        path: "/500",
        isAuthenticated: isLoggedIn,
    });
};

export default {
    get404,
    get500,
};
