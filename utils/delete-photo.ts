import fs from "node:fs";
import path from "node:path";


export function deletePhoto(photoName: string, exceptionName: string): void {
    if (!photoName.endsWith(exceptionName)) {
        fs.unlink(
            path.join(__dirname, "..", "public", photoName),
            (error: any) => {
                if (error) throw error;
            }
        );
    }
}
