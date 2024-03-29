"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Work = exports.workSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.workSchema = new mongoose_1.default.Schema(
  {
    accountId: {
      type: mongoose_1.default.SchemaTypes.ObjectId,
      ref: "account",
    },
    title: {
      type: SchemaTypes.String,
      trim: true,
      required: [true, ResponseMessage.EMPTY_WORK_TITLE],
    },
    verify: {
      type: Boolean,
      default: false,
    },
    link: {
      type: SchemaTypes.String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true },
);
exports.Work = mongoose_1.default.model("Work", exports.workSchema);
exports.default = exports.Work;
