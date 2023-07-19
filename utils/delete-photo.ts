import fs from "node:fs";
import path from "node:path";
import { isDefaultPhoto } from "./is-default-photo";

export function deletePhoto(photoName: string): void {
	if (!isDefaultPhoto(photoName)) {
		fs.unlink(path.join(__dirname, "..", "public", photoName), (error: any) => {
			if (error) throw error;
		});
	}
}
