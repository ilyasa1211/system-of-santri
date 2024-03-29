import { Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

export default class ApiResponse {
  public constructor(private response: Response) {}

  public sendJsonResponse(status: number, data: unknown = null) {
    return this.response.status(status).json({
      status: status,
      message: getReasonPhrase(status),
      data: data,
    });
  }

  public created(data: unknown) {
    return this.sendJsonResponse(StatusCodes.CREATED, data);
  }
  public ok(data: unknown) {
    return this.sendJsonResponse(StatusCodes.OK, data);
  }
  public updated(data: unknown) {
    return this.sendJsonResponse(StatusCodes.OK, data);
  }
  public deleted(data: unknown) {
    return this.sendJsonResponse(StatusCodes.OK, data);
  }
}
