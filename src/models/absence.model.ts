import mongoose, { ObjectId, SchemaTypes } from "mongoose";

export interface IAbsence {
  _id?: string;
  accountId: ObjectId;
  absence: Array<string>;
}

const absenceSchema = new mongoose.Schema<IAbsence>({
  accountId: {
    type: SchemaTypes.ObjectId,
    required: true,
  },
  absence: {
    type: [SchemaTypes.String],
    trim: true,
  },
});

const Absence = mongoose.model<IAbsence>("Absence", absenceSchema);

export default Absence;
