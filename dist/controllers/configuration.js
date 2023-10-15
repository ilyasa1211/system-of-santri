"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {  step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) {  step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationController = void 0;
const http_status_codes_1 = require("http-status-codes");
const configuration_1 = require("../models/configuration");
const errors_1 = require("../enums/errors");
const utils_1 = require("../utils");
class ConfigurationController {
    getConfiguration(key) {
        return function getAccessCode(request, response, next) {
            return __awaiter(this, void 0, void 0, function* () {
                
                    const KEY = new utils_1.CaseStyle(key);
                    const config = yield configuration_1.Configuration.findOne({
                        key: KEY.toSnakeCase(),
                    })
                        .select(["key", "value"])
                        .exec();
                    if (!config) {
                        throw new errors_1.NotFoundError(`The ${key} configuration could not be found by the system. Please check your settings once more and try again.`);
                    }
                    return response.status(http_status_codes_1.StatusCodes.OK).json(config);
                }
                catch (error) {
                    next(error);
                }
            });
        };
    }
    setConfiguration(key) {
        return function setAccessCode(request, response, next) {
            return __awaiter(this, void 0, void 0, function* () {
                
                    const KEY = new utils_1.CaseStyle(key);
                    const inputKey = request.body[KEY.toCamelCase()];
                    if (!inputKey) {
                        throw new errors_1.BadRequestError(`Please enter the needed ${key} to continue.`);
                    }
                    const { modifiedCount } = yield configuration_1.Configuration.updateOne({
                        key: KEY.toSnakeCase(),
                    }, {
                        value: inputKey,
                    });
                    if (!modifiedCount) {
                        throw new Error(`Unfortunately, we must let you know that the attempt to set a new ${key} was unsuccessful.`);
                    }
                    return response.status(http_status_codes_1.StatusCodes.OK).json({
                        message: `The ${key} has been successfully updated. The adjustments have been made.`,
                    });
                }
                catch (error) {
                    next(error);
                }
            });
        };
    }
}
exports.ConfigurationController = ConfigurationController;
