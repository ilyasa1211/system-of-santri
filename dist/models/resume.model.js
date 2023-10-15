import mongoose from "mongoose";
export const resumeSchema = new mongoose.Schema({
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
}, { timestamps: true });
const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
