import mongoose, { ObjectId } from "mongoose";
import { ResponseMessage } from "../enums/response";

export interface IWork {
    accountId: ObjectId | string;
    createdAt: string;
    link: string;
    title: string;
    updatedAt: string;
    verify: boolean;
}

export const workSchema = new mongoose.Schema<IWork>(
    {
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
    },
    { timestamps: true },
);

const Work = mongoose.model<IWork>("Work", workSchema);

export default Work;
