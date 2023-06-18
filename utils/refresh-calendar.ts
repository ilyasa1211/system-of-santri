import { Model } from "mongoose";

export default async function (
  model: Model<any>,
  method: CallableFunction,
): Promise<void> {
  const year: number = new Date().getFullYear();
  await method(model, { year });
}
