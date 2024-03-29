import mongoose, { FilterQuery, SchemaTypes } from "mongoose";

export interface IRole {
  _id?: string;
  id: number;
  name: string;
}

export const roleSchema = new mongoose.Schema<IRole>({
  id: {
    type: SchemaTypes.Number,
  },
  name: {
    type: SchemaTypes.String,
    trim: true,
  },
});

// TODO: create seeder instead

// roleSchema.static("initialize", function (filter: FilterQuery<IRole>) {
//   this.exists(filter, async (error, role) => {
//     if (error) throw error;
//     if (!role) {
//       const data = ["admin", "manager", "santri"].map((name, index) => {
//         return { id: +index + 1, name };
//       });

//       await this.insertMany(data);
//     }
//   });
// });

const Role = mongoose.model<IRole>("Role", roleSchema);

export default Role;
