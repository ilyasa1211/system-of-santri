import mongoose from "mongoose";
import { ResponseMessage } from "../enums/response";
export const noteSchema = new mongoose.Schema({
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
const Note = mongoose.model("Note", noteSchema);
export default Note;
