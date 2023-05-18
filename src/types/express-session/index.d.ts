import session from "express-session";
import { IUser } from "../prodCart";
import User from "../../models/userModel";

declare module "express-session" {
    interface SessionData {
        isLoggedIn?: boolean;
        user?: User;
    }
}
