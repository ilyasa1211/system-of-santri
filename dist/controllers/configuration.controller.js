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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAccessCode = exports.getAccessCode = void 0;
const http_status_codes_1 = require("http-status-codes");
const configuration_model_1 = __importDefault(require("../models/configuration.model"));
const errors_1 = require("../errors");
function getAccessCode(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const config = yield configuration_model_1.default.findOne({ key: "access_code" });
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
exports.getAccessCode = getAccessCode;
function setAccessCode(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { accessCode } = request.body;
            if (!accessCode) {
                throw new errors_1.BadRequestError("Please enter the needed access code to continue.");
            }
            const { modifiedCount } = yield configuration_model_1.default.updateOne({
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
exports.setAccessCode = setAccessCode;
