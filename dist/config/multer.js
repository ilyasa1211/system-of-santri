"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const multer_1 = __importDefault(require("multer"));
const node_path_1 = __importDefault(require("node:path"));
const node_crypto_1 = __importDefault(require("node:crypto"));
module.exports = function (paths) {
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, callback) {
            callback(null, node_path_1.default.join(__dirname, "..", "public", "images", paths));
        },
        filename: function (req, file, callback) {
            const { mimetype } = file;
            const fileExt = mimetype.slice(mimetype.indexOf("/") + 1);
            callback(null, node_crypto_1.default.randomUUID().concat(".", fileExt));
        },
    });
    return (0, multer_1.default)({ storage });
};
