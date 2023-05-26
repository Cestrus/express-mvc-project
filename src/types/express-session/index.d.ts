import session from "express-session";
import User from "../../models/user.model";

declare module "express-session" {
    interface SessionData {
        isLoggedIn?: boolean;
        user?: User;
        oldInputValues?: Record<string, any>;
        validationErrorFields?: string[];
    }
}
