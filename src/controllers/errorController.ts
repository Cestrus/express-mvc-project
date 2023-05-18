import { Request, Response, NextFunction } from "express";

const get404 = (req: Request, res: Response, next: NextFunction) => {
    const isLoggedIn = req.session.isLoggedIn;
    res.status(404).render("404", {
        pageTitle: "Page Not Found",
        path: "error404",
        isAuthenticated: isLoggedIn,
    });
};

export default {
    get404,
};
