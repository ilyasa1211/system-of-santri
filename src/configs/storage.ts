import multer, { Multer } from "multer";
import path from "node:path";
import crypto from "node:crypto";
import { Request } from "express";

export class Storage {
  public static local(folderName: string): Multer {
    const storage = multer.diskStorage({
      destination: function (
        request: Request,
        file: Express.Multer.File,
        callback: (error: Error | null, destination: string) => void,
      ) {
        callback(
          null,
          path.join(__dirname, "..", "public", "images", folderName),
        );
      },
      filename: function (
        request: Request,
        file: Express.Multer.File,
        callback: (error: Error | null, destination: string) => void,
      ) {
        const { mimetype } = file;
        const fileExt = mimetype.slice(mimetype.indexOf("/") + 1);
        callback(null, crypto.randomUUID().concat(".", fileExt));
      },
    });
    return multer({ storage });
  }
}
