import mongoose from "mongoose";
export const roleSchema = new mongoose.Schema({
  id: {
    type: SchemaTypes.Number,
  },
  name: {
    type: SchemaTypes.String,
    trim: true,
  },
});
roleSchema.static("initialize", function (filter) {
  this.exists(filter, async (error, role) => {
    if (error) throw error;
    if (!role) {
      const data = ["admin", "manager", "santri"].map((name, index) => {
        return { id: +index + 1, name };
      });
      await this.insertMany(data);
    }
  });
});
const Role = mongoose.model("Role", roleSchema);
export default Role;
