import multer, { Multer } from "multer";
import path from "node:path";
import crypto from "node:crypto";

export = function (paths: string): Multer {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "public", "images", paths));
    },
    filename: function (req, file, cb) {
      const { mimetype } = file;
      const fileExt = mimetype.slice(mimetype.indexOf("/") + 1);
      cb(null, crypto.randomUUID().concat(".", fileExt));
    },
  });
  return multer({ storage });
}
