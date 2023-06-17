import { Model } from "mongoose";

import { NotFoundError } from "../errors";
import { IConfiguration } from "../models";

export default async function (Model: Model<IConfiguration>): Promise<string> {
  const { value } = await Model.findOne({ key: "access_code" }) as IConfiguration;
  if (!value) {
    throw new NotFoundError(
      "The Access Code configuration could not be found by the system. Please check your settings once more and try again.",
    );
  }
  return value;
};
