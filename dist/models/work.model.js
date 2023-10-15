import mongoose from "mongoose";
import { ResponseMessage } from "../enums/response";
export const workSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Account",
    },
    title: {
        type: String,
        trim: true,
        required: [true, ResponseMessage.EMPTY_WORK_TITLE],
    },
    verify: {
        type: Boolean,
        default: false,
    },
    link: {
        type: String,
        trim: true,
        default: null,
    },
}, { timestamps: true });
const Work = mongoose.model("Work", workSchema);
export default Work;
