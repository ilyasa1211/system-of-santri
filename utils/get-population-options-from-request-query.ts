import { Request } from "express";

export function getPopulationOptionsFromRequestQuery(request: Request) {
	const {
		resume,
		role,
		absense,
		work,
	} = request.query;

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
