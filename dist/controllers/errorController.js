"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get404 = (req, res, next) => {
    res.status(404).render("404", {
        pageTitle: "Page Not Found",
        path: "error404",
    });
};
exports.default = {
    get404,
};
