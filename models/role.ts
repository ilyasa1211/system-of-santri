import mongoose from "mongoose";

export interface IRole {
  id: number;
  name: string;
}

export const roleSchema = new mongoose.Schema<IRole>({
  id: {
    type: Number,
  },
  name: {
    type: String,
    trim: true,
  },
});

export const Role = mongoose.model<IRole>("Role", roleSchema);

export default Role;