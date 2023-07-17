"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateJwtToken(payload) {
    const { id, email, name } = payload;
    return jsonwebtoken_1.default.sign({ id, email, name }, process.env.JWT_SECRET);
}
exports.generateJwtToken = generateJwtToken;
