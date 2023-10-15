import mongoose, { FilterQuery } from "mongoose";
import Token from "../helpers/token";

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
        default: Token.generateRandomToken(3),
    },
});

configurationSchema.static(
    "findOrCreate",
    function (filter: FilterQuery<IConfiguration>) {
        this.exists(filter, async (error, Configuration) => {
            if (error) throw error;
            if (!Configuration) await this.create(filter);
        });
    },
);

const Configuration = mongoose.model<IConfiguration>(
    "Configuration",
    configurationSchema,
);

export default Configuration;
