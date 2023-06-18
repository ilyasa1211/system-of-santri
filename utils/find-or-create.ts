import { Model } from "mongoose";

export default async function findOrCreate<T>(
  Model: Model<T>,
  filterOrCreate: Record<string, any> = { id: 0 },
): Promise<any> {
  const model = await Model.findOne(filterOrCreate);
  return (!model) ? await Model.create(filterOrCreate) : model;
}
