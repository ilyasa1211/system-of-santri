import { StatusCodes } from "http-status-codes";
import { ResponseMessage } from "../enums/response";
export default function errorHandler(error, request, response, next) {
    var _a;
    if (error.message.startsWith("Cast to ObjectId failed")) {
        error.message = ResponseMessage.INVALID_ACCOUNT_ID;
        error.code = StatusCodes.BAD_REQUEST;
    }
    if (((_a = error.message) === null || _a === void 0 ? void 0 : _a.indexOf("duplicate key error")) !== -1) {
        error.code = StatusCodes.CONFLICT;
        error.message = ResponseMessage.SIGNUP_CONFLICT;
    }
    if (typeof error.code !== "number" ||
        error.code > 500 ||
        error.code < 100) {
        error.code = 500;
    }
    return response.status(error.code || 500).json({ message: error.message });
}
