export function getPopulationOptionsFromRequestQuery(request, populationPathAvailable = ["resume", "role", "work", "absence"]) {
    const { query } = request;
    const fieldsToPopulate = [];
    populationPathAvailable.forEach((path) => {
        const populateOptions = {
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
