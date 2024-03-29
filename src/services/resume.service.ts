import { Request } from "express";
import ResumeRepository from "../repositories/resume.repository";
import { ConflictError, NotFoundError } from "../errors/errors";
import { ResponseMessage } from "../enums/response";
import { IAccount } from "../models/account.model";
import authorize from "../utils/authorize";
import { HydratedDocument } from "mongoose";

export default class ResumeService {
  public constructor(private repository: ResumeRepository) {}

  public findAll() {
    return this.repository.findAllSortBy("createdAt", "descending");
  }

  public async findById(id: string) {
    const resume = await this.repository.findById(id);

    if (!resume) {
      throw new NotFoundError(ResponseMessage.RESUME_NOT_FOUND);
    }

    return resume;
  }

  public async create(
    payload: Request["body"],
    user: HydratedDocument<IAccount>,
  ) {
    const { id: accountId } = user;

    const isExist = await this.repository.isExist({ accountId });

    if (isExist) {
      throw new ConflictError(ResponseMessage.RESUME_CONFLICT);
    }

    payload.accountId = accountId;

    return this.repository.create(payload);
  }

  public async updateById(
    id: string,
    payload: Request["body"],
    user: HydratedDocument<IAccount>,
  ) {
    const resume = await this.repository.findById(id);

    if (!resume) {
      throw new NotFoundError(ResponseMessage.RESUME_NOT_FOUND);
    }

    authorize(user, resume.accountId.toString());

    Object.assign(resume, payload);

    await resume.save();

    return resume;
  }

  public async deleteById(id: string, user: HydratedDocument<IAccount>) {
    const resume = await this.repository.findById(id);

    if (!resume) {
      throw new NotFoundError(ResponseMessage.RESUME_NOT_FOUND);
    }

    authorize(user, resume.accountId.toString());

    return await resume.deleteOne();
  }
}
