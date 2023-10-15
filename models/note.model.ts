import mongoose, { ObjectId } from "mongoose";
import { ResponseMessage } from "../enums/response";

export interface INote {
    learningId: ObjectId | string;
    message: string;
}

export const noteSchema = new mongoose.Schema<INote>({
    learningId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Learning",
    },
    message: {
        type: String,
        trim: true,
        require: [true, ResponseMessage.EMPTY_NOTE_MESSAGE],
    },
});

const Note = mongoose.model<INote>("Note", noteSchema);

export default Note;
