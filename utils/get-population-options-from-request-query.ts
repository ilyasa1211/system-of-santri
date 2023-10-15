import { Request } from "express";
import { PopulateOptions } from "mongoose";

export function getPopulationOptionsFromRequestQuery(
    query: Request["query"],
    populationPathAvailable = ["resume", "role", "work", "absence"],
) {
    const fieldsToPopulate: Array<PopulateOptions> = [];

    populationPathAvailable.forEach((path: string) => {
        const populateOptions: PopulateOptions = {
            path: path,
            select: "-_id -__v",
        };
        if (path === "absence") {
            const currentYear = new Date().getFullYear();
            populateOptions.match = { year: currentYear };
            populateOptions.select = "-id -_id -__v";
        }
        if (query[path] === "true") {
            fieldsToPopulate.push(populateOptions);
        }
    });
    return fieldsToPopulate;
}
