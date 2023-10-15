import { StatusCodes, getReasonPhrase } from "http-status-codes";
export default class ApiResponse {
    constructor(response) {
        this.response = response;
    }
    sendJsonResponse(status, data = null) {
        return this.response.status(status).json({
            status: status,
            message: getReasonPhrase(status),
            data: data,
        });
    }
    created(data) {
        return this.sendJsonResponse(StatusCodes.CREATED, data);
    }
    ok(data) {
        return this.sendJsonResponse(StatusCodes.OK, data);
    }
    updated(data, returnData = false) {
        if (returnData) {
            return this.sendJsonResponse(StatusCodes.OK, data);
        }
        return this.sendJsonResponse(StatusCodes.NO_CONTENT);
    }
    deleted(data, returnData = false) {
        if (returnData) {
            return this.sendJsonResponse(StatusCodes.OK, data);
        }
        return this.sendJsonResponse(StatusCodes.NO_CONTENT);
    }
}
