"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPopulationOptionsFromRequestQuery = void 0;
function getPopulationOptionsFromRequestQuery(request, populationPathAvailable = ["resume", "role", "work", "absense"]) {
    const { query } = request;
    const fieldsToPopulate = [];
    populationPathAvailable.forEach((path) => {
        const populateOptions = {
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
exports.getPopulationOptionsFromRequestQuery = getPopulationOptionsFromRequestQuery;
