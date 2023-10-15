import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../enums/errors";
import { CamelCase, SnakeCase } from "../helpers/case-style";
import Configuration from "../models/configuration.model";
export default class ConfigurationController {
    getConfiguration(key) {
        return async function getAccessCode(request, response) {
            const KEY = new SnakeCase(key).convert();
            const config = await Configuration.findOne({
                key: KEY,
            })
                .select(["key", "value"])
                .exec();
            if (!config) {
                throw new NotFoundError(`The ${key} configuration could not be found by the system. Please check your settings once more and try again.`);
            }
            return response.status(StatusCodes.OK).json(config);
        };
    }
    setConfiguration(key) {
        return async function setAccessCode(request, response) {
            const KEY = new CamelCase(key).convert();
            const inputKey = request.body[KEY];
            if (!inputKey) {
                throw new BadRequestError(`Please enter the needed ${key} to continue.`);
            }
            const { modifiedCount } = await Configuration.updateOne({
                key: new SnakeCase(key).convert(),
            }, {
                value: inputKey,
            });
            if (!modifiedCount) {
                throw new Error(`Unfortunately, we must let you know that the attempt to set a new ${key} was unsuccessful.`);
            }
            return response.status(StatusCodes.OK).json({
                message: `The ${key} has been successfully updated. The adjustments have been made.`,
            });
        };
    }
}
