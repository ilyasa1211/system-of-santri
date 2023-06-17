import { Model } from "mongoose";

export default async function (
  model: Model<any>,
  method: CallableFunction,
): Promise<void> {
  const roleExist = await model.exists({ id: 1 });
  if (!roleExist) {
    ["admin", "manager", "santri"].forEach(async (name, index) =>
      await method(model, { id: +index + 1, name })
    );
  }
};
