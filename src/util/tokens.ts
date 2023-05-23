import crypto from "node:crypto";

export const getToken = (): string => {
    try {
        const buffer = crypto.randomBytes(32);
        return buffer.toString("hex");
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
        return err;
    }
};
