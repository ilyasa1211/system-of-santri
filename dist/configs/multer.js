import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
export default function Storage(paths) {
    const storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, path.join(__dirname, "..", "public", "images", paths));
        },
        filename: function (req, file, callback) {
            const { mimetype } = file;
            const fileExt = mimetype.slice(mimetype.indexOf("/") + 1);
            callback(null, crypto.randomUUID().concat(".", fileExt));
        },
    });
    return multer({ storage });
}
