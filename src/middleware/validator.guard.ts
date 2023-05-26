import { check, body } from "express-validator";

const checkPassword = (fieldname: string) => {
    return body(fieldname)
        .trim()
        .isLength({ min: 3 })
        .withMessage("Password must have more than 2 characters")
        .isAlphanumeric()
        .withMessage("Password must have numeric or alphebet sign only");
};

const checkEmail = (fieldName: string) => {
    return check(fieldName, "Invalid Email").trim().isEmail().normalizeEmail();
};

const confirmPassword = (fieldName: string) => {
    return body(fieldName).custom((value, { req }) => {
        if (value !== req.body.password) {
            throw Error("Invalid confirm password");
        }
        return true;
    });
};

const checkURL = (fieldName: string) => {
    return body(fieldName).trim().isURL().withMessage("Invalid URL address");
};

const checkNumeric = (fieldName: string) => {
    return body(fieldName)
        .trim()
        .isNumeric()
        .withMessage("This field must have numeric type data");
};

const checkText = (fieldName: string) => {
    return body(fieldName)
        .trim()
        .isLength({ min: 1 })
        .withMessage("Text must have more than 1 characters.");
};

export default {
    checkPassword,
    checkEmail,
    confirmPassword,
    checkURL,
    checkNumeric,
    checkText,
};
