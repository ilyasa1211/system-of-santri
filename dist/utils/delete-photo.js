import { isDefaultPhoto } from "./is-default-photo";
import fs from "node:fs";
import path from "node:path";
export function deletePhoto(photoName) {
    if (!isDefaultPhoto(photoName)) {
        fs.unlink(path.join(__dirname, "..", "public", photoName), (error) => {
            if (error)
                throw error;
        });
    }
}
