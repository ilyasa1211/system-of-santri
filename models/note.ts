import mongoose, { ObjectId } from "mongoose";

export interface INote {
  learning_id: ObjectId | string;
  note: number;
}

export const noteSchema = new mongoose.Schema<INote>({
  learning_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Learning",
  },
  note: {
    type: Number,
    require: [true, "Please type in your message."],
  },
});

export const Note = mongoose.model<INote>("Note", noteSchema);

export default Note;