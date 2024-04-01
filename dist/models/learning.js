"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Learning = exports.learningSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
exports.learningSchema = new mongoose_1.default.Schema(
  {
    division: {
      type: SchemaTypes.String,
      trim: true,
      required: [true, ResponseMessage.EMPTY_DIVISION],
    },
    thumbnail: {
      type: SchemaTypes.String,
      default: path_1.default.join(
        "images",
        String(process.env.SAVE_LEARNING_THUMBNAIL),
        String(process.env.DEFAULT_THUMBNAIL_NAME),
      ),
    },
    title: {
      type: SchemaTypes.String,
      trim: true,
      required: [true, "Please include the entry's title."],
    },
    content: {
      type: SchemaTypes.String,
      trim: true,
      required: [true, "Enter your entry's content please."],
    },
    goal: {
      type: SchemaTypes.String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true },
);
exports.Learning = mongoose_1.default.model("Learning", exports.learningSchema);
exports.default = exports.Learning;
