import { Request } from "express";
import { PopulateOptions } from "mongoose";

export function getPopulationOptionsFromRequestQuery(
	request: Request,
	populationPathAvailable = ["resume", "role", "work", "absense"]
) {
	const { query } = request;
	const fieldsToPopulate: Array<PopulateOptions> = [];

	populationPathAvailable.forEach((path: string) => {
		const populateOptions: PopulateOptions = {
			path: path,
			select: "-_id -__v",
		};
		if (path === "absense") {
			const currentYear = new Date().getFullYear();
			populateOptions.match = { year: currentYear };
			populateOptions.select = "-id -_id -__v";
		}
		if (query.hasOwnProperty(path)) {
			fieldsToPopulate.push(populateOptions);
		}
	});
	return fieldsToPopulate;
}
