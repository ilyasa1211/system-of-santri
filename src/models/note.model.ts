import mongoose, { ObjectId, SchemaTypes } from "mongoose";
import { ResponseMessage } from "../enums/response";

export interface INote {
  _id?: string;
  learningId: ObjectId | string;
  message: string;
}

export const noteSchema = new mongoose.Schema<INote>({
  learningId: {
    type: SchemaTypes.ObjectId,
    ref: "Learning",
  },
  message: {
    type: SchemaTypes.String,
    trim: true,
    require: [true, ResponseMessage.EMPTY_NOTE_MESSAGE],
  },
});

const Note = mongoose.model<INote>("Note", noteSchema);

export default Note;
