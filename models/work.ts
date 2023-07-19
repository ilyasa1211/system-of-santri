import mongoose, { ObjectId } from "mongoose";

export interface IWork {
	accountId: ObjectId | string;
	title: string;
	link: string;
	verify: boolean;
	createdAt: string;
	updatedAt: string;
}

export const workSchema = new mongoose.Schema<IWork>(
	{
		accountId: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "account",
		},
		title: {
			type: String,
			trim: true,
			required: [true, "Please enter the needed Title to continue."],
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
	{ timestamps: true }
);

export const Work = mongoose.model<IWork>("Work", workSchema);

export default Work;
