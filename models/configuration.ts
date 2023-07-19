import mongoose from "mongoose";
import { generateToken } from "../utils";

export interface IConfiguration {
	key: string;
	value: string;
}

export const configurationSchema = new mongoose.Schema<IConfiguration>({
	key: {
		type: String,
		trim: true,
		unique: true,
		required: true,
	},
	value: {
		type: String,
		trim: true,
		default: generateToken(3),
	},
});

export const Configuration = mongoose.model<IConfiguration>(
	"Configuration",
	configurationSchema
);

export default Configuration;
