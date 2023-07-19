import mongoose, { ObjectId } from "mongoose";
export interface IResume {
	accountId: ObjectId | string;
	technicalSkill: string;
	education: string;
	personalBackground: string;
	experience: string;
	createdAt: string;
	updatedAt: string;
}

export const resumeSchema = new mongoose.Schema<IResume>(
	{
		accountId: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "Account",
		},
		technicalSkill: {
			type: String,
			trim: true,
			default: null,
		},
		education: {
			type: String,
			trim: true,
			default: null,
		},
		personalBackground: {
			type: String,
			trim: true,
			default: null,
		},
		experience: {
			type: String,
			trim: true,
			default: null,
		},
	},
	{ timestamps: true }
);

export const Resume = mongoose.model<IResume>("Resume", resumeSchema);

export default Resume;
