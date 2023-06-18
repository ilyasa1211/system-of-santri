"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = __importDefault(require("node:crypto"));
/**
 * Used to generated random string in uppercase
 */
function generateToken(length = 20) {
    return node_crypto_1.default.randomBytes(length).toString("hex").toUpperCase();
}
exports.default = generateToken;
