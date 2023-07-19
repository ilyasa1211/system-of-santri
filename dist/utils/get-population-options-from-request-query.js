"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPopulationOptionsFromRequestQuery = void 0;
function getPopulationOptionsFromRequestQuery(request) {
    const { resume, role, absense, work, } = request.query;
    const fieldsToPopulate = [];
    Boolean(resume) && fieldsToPopulate.push("resume");
    Boolean(role) && fieldsToPopulate.push("role");
    Boolean(absense) && fieldsToPopulate.push("absense");
    Boolean(work) &&
        fieldsToPopulate.push({
            path: "role",
            foreignField: "id",
            select: "id name -_id",
        });
    return fieldsToPopulate;
}
exports.getPopulationOptionsFromRequestQuery = getPopulationOptionsFromRequestQuery;
