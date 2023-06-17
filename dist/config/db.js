"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const uri = process.env.MONGODB_CONNECTION_STRING ||
    "mongodb://localhost:27017";
mongoose_1.default.set("strictQuery", true);
mongoose_1.default.connect(uri, () => console.info("Successfully establishing a database connection."));
module.exports = mongoose_1.default;
