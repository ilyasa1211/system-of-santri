"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessCode = void 0;
const http_status_codes_1 = require("http-status-codes");
const configuration_1 = require("../models/configuration");
const errors_1 = require("../traits/errors");
class AccessCode {
    getAccessCode(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const config = yield configuration_1.Configuration.findOne({ key: "access_code" });
                if (!config) {
                    throw new errors_1.NotFoundError("The Access Code configuration could not be found by the system. Please check your settings once more and try again.");
                }
                return response.status(http_status_codes_1.StatusCodes.OK).json(config);
            }
            catch (error) {
                next(error);
            }
        });
    }
    setAccessCode(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { accessCode } = request.body;
                if (!accessCode) {
                    throw new errors_1.BadRequestError("Please enter the needed access code to continue.");
                }
                const { modifiedCount } = yield configuration_1.Configuration.updateOne({
                    key: "access_code",
                }, {
                    value: accessCode,
                });
                if (!modifiedCount) {
                    throw new Error("Unfortunately, we must let you know that the attempt to set a new access code was unsuccessful.");
                }
                return response.status(http_status_codes_1.StatusCodes.OK).json({
                    message: "The access code has been successfully updated. The adjustments have been made.",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AccessCode = AccessCode;
