import mongoose from "mongoose";
import path from "path";
import { ResponseMessage } from "../enums/response";
export const learningSchema = new mongoose.Schema({
    division: {
        type: String,
        trim: true,
        required: [true, ResponseMessage.EMPTY_DIVISION],
    },
    thumbnail: {
        type: String,
        default: path.join("images", String(process.env.SAVE_LEARNING_THUMBNAIL), String(process.env.DEFAULT_THUMBNAIL_NAME)),
    },
    title: {
        type: String,
        trim: true,
        required: [true, "Please include the entry's title."],
    },
    content: {
        type: String,
        trim: true,
        required: [true, "Enter your entry's content please."],
    },
    goal: {
        type: String,
        trim: true,
        default: null,
    },
}, { timestamps: true });
const Learning = mongoose.model("Learning", learningSchema);
export default Learning;
