import { Request } from "express";
import ApiResponse from "../utils/api-response";
import WorkInterface from "../repositories/interfaces/work.interface";
import WorkService from "../services/work.service";
import { IUser } from "../models/account.model";
import { HydratedDocument } from "mongoose";

export class WorkController {
  public constructor(
    private readonly workService: WorkService,
    private readonly apiResponse: ApiResponse,
  ) {}

  public async index(request: Request) {
    const works = await this.workService.findAll();

    return this.apiResponse.ok({ works });
  }
  public async show(request: Request) {
    const { workId } = request.params;
    const work = await this.workService.findId(workId);

    return this.apiResponse.ok({ work });
  }
  public async create(request: Request) {
    const work = await this.workService.create(
      request.body,
      request.user as HydratedDocument<IUser>,
    );

    return this.apiResponse.created({ work });
  }
  public async update(request: Request) {
    const workId: string = request.params.workId;

    await this.workService.updateId(
      workId,
      request.body,
      request.user as HydratedDocument<IUser>,
    );

    return this.apiResponse.updated(null);
  }
  public async destroy(request: Request) {
    const workId: string = request.params.workId;

    await this.workService.deleteId(
      workId,
      request.user as HydratedDocument<IUser>,
    );

    return this.apiResponse.deleted(null);
  }
}
