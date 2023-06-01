import fs from "node:fs";
import path from "node:path";

import mainPath from "./path";

export const deleteFile = (imagePath: string): void => {
    fs.unlink(path.join(mainPath, "../", imagePath), (err) => {
        if (err) {
            console.log(err);
        }
    });
};
