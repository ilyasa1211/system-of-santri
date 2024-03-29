import mongoose from "mongoose";
import Token from "../helpers/token";
export const configurationSchema = new mongoose.Schema({
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
configurationSchema.static("findOrCreate", function (filter) {
  this.exists(filter, async (error, Configuration) => {
    if (error) throw error;
    if (!Configuration) await this.create(filter);
  });
});
const Configuration = mongoose.model("Configuration", configurationSchema);
export default Configuration;
