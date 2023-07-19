import { Model } from "mongoose";

import { NotFoundError } from "../traits/errors";
import { IConfiguration } from "../models";

export default async function (
	Model: Model<IConfiguration>,
	key: string = "access_code",
): Promise<string> {
	const { value } = await Model.findOne({
		key,
	}) as IConfiguration;
	if (!value) {
		throw new NotFoundError(
			"The Access Code configuration could not be found by the system. Please check your settings once more and try again.",
		);
	}
	return value;
}
