import { Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

export default class ApiResponse {
  public constructor(private response: Response) { }

  public sendJsonResponse(status: number, data: any = null) {
    return this.response.status(status).json({
      status: status,
      message: getReasonPhrase(status),
      data: data,
    });
  }

  public created(data: any) {
    return this.sendJsonResponse(StatusCodes.CREATED, data);
  }
  public ok(data: any) {
    return this.sendJsonResponse(StatusCodes.OK, data);
  }
  public updated(data: any) {
    return this.sendJsonResponse(StatusCodes.OK, data);
  }
  public deleted(data: any) {
    return this.sendJsonResponse(StatusCodes.OK, data);
  }
}
