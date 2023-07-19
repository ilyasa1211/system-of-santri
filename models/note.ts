import mongoose, { ObjectId } from "mongoose";

export interface INote {
	learningId: ObjectId | string;
	note: string;
}

export const noteSchema = new mongoose.Schema<INote>({
	learningId: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: "Learning",
	},
	note: {
		type: String,
		trim: true,
		require: [true, "Please type in your message."],
	},
});

export const Note = mongoose.model<INote>("Note", noteSchema);

export default Note;
