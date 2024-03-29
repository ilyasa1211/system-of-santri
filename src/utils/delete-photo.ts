import { isDefaultPhoto } from "./is-default-photo";
import fs from "node:fs";
import path from "node:path";

export function deletePhoto(photoName: string): void {
  if (!isDefaultPhoto(photoName)) {
    fs.unlink(
      path.join(__dirname, "..", "public", photoName),
      (error: unknown) => {
        if (error) throw error;
      },
    );
  }
}
