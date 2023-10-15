import mongoose, { FilterQuery } from "mongoose";

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

roleSchema.static("initialize", function (filter: FilterQuery<IRole>) {
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

const Role = mongoose.model<IRole>("Role", roleSchema);

export default Role;
