"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePhoto = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const is_default_photo_1 = require("./is-default-photo");
function deletePhoto(photoName) {
    if (!(0, is_default_photo_1.isDefaultPhoto)(photoName)) {
        node_fs_1.default.unlink(node_path_1.default.join(__dirname, "..", "public", photoName), (error) => {
            if (error)
                throw error;
        });
    }
}
exports.deletePhoto = deletePhoto;
