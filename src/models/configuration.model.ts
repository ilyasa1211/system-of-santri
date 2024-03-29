import mongoose, { FilterQuery, SchemaTypes } from "mongoose";
import Token from "../helpers/token";

export interface IConfiguration {
  _id?: string;
  key: string;
  value: string;
}

export const configurationSchema = new mongoose.Schema<IConfiguration>({
  key: {
    type: SchemaTypes.String,
    trim: true,
    unique: true,
    required: true,
  },
  value: {
    type: SchemaTypes.String,
    trim: true,
    default: Token.generateRandomToken(3),
  },
});

// TODO: create seeder instead
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
