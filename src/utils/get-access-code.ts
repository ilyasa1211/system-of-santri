import { Model } from "mongoose";

import { NotFoundError } from "../errors/errors";
import { IConfiguration } from "../models/configuration.model";

export default async function (
  Model: Model<IConfiguration>,
  key: string = "access_code",
): Promise<string> {
  const { value } = (await Model.findOne({
    key,
  })) as IConfiguration;
  if (!value) {
    throw new NotFoundError("Config not found!");
  }
  return value;
}
