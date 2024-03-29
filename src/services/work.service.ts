import { Request } from "express";
import Work from "../models/work.model";
import WorkRepository from "../repositories/work.repository";
import { NotFoundError } from "../errors/errors";
import { ResponseMessage } from "../enums/response";
import authorize from "../utils/authorize";
import { HydratedDocument } from "mongoose";
import { IAccount, IUser } from "../models/account.model";

export default class WorkService {
  public constructor(private workRepository: WorkRepository) {}

  public async findAll() {
    // TODO: create a pagination
    const works = await this.workRepository.findAllSortBy("accountId", "descending");

    return works;
  }

  public async findId(id: string) {
    // TODO: add select
    const work = await this.workRepository.findById(id);

    if (!work) {
      throw new NotFoundError(ResponseMessage.WORK_NOT_FOUND);
    }

    return work;
  }
  public async create(
    payload: Record<string, unknown>,
    user: HydratedDocument<IUser>,
  ) {
    payload.accountId = user.id;

    const work = await this.workRepository.create(payload);

    user.workIds.push(work.id);

    const updatedAccount = await user.save();

    return work;
  }
  public async updateId(
    id: string,
    payload: Record<string, unknown>,
    user: HydratedDocument<IUser>,
  ) {
    const work = await this.workRepository.findById(id);

    if (!work) {
      throw new NotFoundError(ResponseMessage.WORK_NOT_FOUND);
    }
    Object.assign(work, payload);

    authorize(user, work.accountId.toString());

    const updatedWork = await work.save();

    return updatedWork;
  }

  public async deleteId(id: string, user: HydratedDocument<IAccount>) {
    const work = await this.workRepository.findById(id);

    if (!work) {
      throw new NotFoundError(ResponseMessage.WORK_NOT_FOUND);
    }

    authorize(user, work.accountId.toString());

    return await work.deleteOne();
  }
}
