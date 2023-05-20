import { Request, Response, NextFunction } from "express";

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    }
    next();
};
