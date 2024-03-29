"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Calendar = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const calendar_1 = __importDefault(require("../utils/calendar"));
const calendarSchema = new mongoose_1.default.Schema(
  {
    id: {
      type: SchemaTypes.Number,
      default: 0,
    },
    year: {
      type: SchemaTypes.Number,
      unique: true,
    },
    months: {
      type: Object,
    },
  },
  { timestamps: true },
);
calendarSchema.pre("save", function (next) {
  this.months = (0, calendar_1.default)();
  this.year = new Date().getFullYear();
  next();
});
exports.Calendar = mongoose_1.default.model("Absence", calendarSchema);
exports.default = exports.Calendar;
