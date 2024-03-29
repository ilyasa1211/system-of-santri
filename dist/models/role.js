"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.roleSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.roleSchema = new mongoose_1.default.Schema({
  id: {
    type: SchemaTypes.Number,
  },
  name: {
    type: SchemaTypes.String,
    trim: true,
  },
});
exports.Role = mongoose_1.default.model("Role", exports.roleSchema);
exports.default = exports.Role;
