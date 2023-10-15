import { NotFoundError } from "../enums/errors";
export default async function (Model, key = "access_code") {
    const { value } = (await Model.findOne({
        key,
    }));
    if (!value) {
        throw new NotFoundError("The Access Code configuration could not be found by the system. Please check your settings once more and try again.");
    }
    return value;
}
