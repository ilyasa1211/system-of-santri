import { Request } from "express";
import ResumeRepository from "../repositories/resume.repository";
import ApiResponse from "../utils/api-response";
import ResumeService from "../services/resume.service";
import { IAccount } from "../models/account.model";
import { HydratedDocument } from "mongoose";

export class ResumeController {
  public constructor(
    private readonly service: ResumeService,
    private readonly apiResponse: ApiResponse,
  ) {}

  public async index(request: Request) {
    // TODO: create service
    const resumes = await this.service.findAll();

    return this.apiResponse.ok({ resumes });
  }

  public async show(request: Request) {
    const resumeId: string = request.params.resumeId;

    const resume = await this.service.findById(resumeId);

    return this.apiResponse.ok({ resume });
  }

  public async create(request: Request) {
    const payload = request.body;
    const user = request.user as HydratedDocument<IAccount>;

    const resume = this.service.create(payload, user);

    return this.apiResponse.created(resume);
  }

  public async update(request: Request) {
    const resumeId: string = request.params.resumeId;
    const payload = request.body;
    const user = request.user as HydratedDocument<IAccount>;

    // TODO: remove data
    const data = await this.service.updateById(resumeId, payload, user);

    return this.apiResponse.updated(data);
  }

  public async destroy(request: Request) {
    const resumeId: string = request.params.resumeId;
    const user = request.user as HydratedDocument<IAccount>;

    const data = await this.service.deleteById(resumeId, user);

    return this.apiResponse.deleted(data);
  }
}
