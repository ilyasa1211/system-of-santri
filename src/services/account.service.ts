import { getPopulationOptionsFromRequestQuery } from "../utils/get-population-options-from-request-query";
import { Request } from "express";
import AccountRepository from "../repositories/account.repository";
import Password from "../helpers/password";
import Account, { IAccount } from "../models/account.model";
import authorize from "../utils/authorize";
import ResumeRepository from "../repositories/resume.repository";
import WorkRepository from "../repositories/work.repository";
import Resume from "../models/resume.model";
import Work from "../models/work.model";
import { ResponseMessage } from "../enums/response";
import { NotFoundError } from "../errors/errors";
import { deletePhoto } from "../utils/delete-photo";
import { HydratedDocument } from "mongoose";

export default class AccountService {
  private options;

  public constructor(
    private repository: AccountRepository,
    // private resumeRepository: ResumeRepository,
    // private workRepository: WorkRepository,
  ) {
    this.options = getPopulationOptionsFromRequestQuery;
  }

  public getAllAccounts(query: Request["query"]) {
    const fieldsToPopulate = this.options(query);
    return this.repository.findAll(fieldsToPopulate);
  }

  public getDisabledAccounts(query: Request["query"]) {
    const fieldsToPopulate = this.options(query);
    return this.repository.findOne(
      { deletedAt: { $ne: null } },
      fieldsToPopulate,
    );
  }

  public async restoreAccount(accountId: string, request: Request) {
    const account = await this.repository.isExist(accountId);
    if (!account) {
      throw new NotFoundError(ResponseMessage.ACCOUNT_NOT_FOUND);
    }
    authorize(request.user, account._id.toString());
    return this.repository.updateById(accountId, {
      deletedAt: null,
    });
  }

  public async deleteById(
    accountId: string,
    user: HydratedDocument<IAccount>,
  ) {
    const account = await this.repository.findById(accountId);

    if (!account) {
      throw new NotFoundError(ResponseMessage.ACCOUNT_NOT_FOUND);
    }
    
    authorize(user, accountId);

    const deleted = await account.deleteOne();

    deletePhoto(user.avatar);

    return deleted;
  }

  public create(payload: Request["body"], file: Request["file"]) {
    const data = Object.assign({}, payload, {
      verify: true,
      password: Password.hash(payload.password),
      avatar: file ? file.filename : undefined,
    });

    return this.repository.create(data);
  }

  public async findById(accountId: string, query: Request["query"]) {
    const fieldsToPopulate = this.options(query);

    const account = await this.repository.findById(accountId, fieldsToPopulate);

    if (!account) {
      throw new NotFoundError(ResponseMessage.ACCOUNT_NOT_FOUND);
    }

    return account;
  }

  public async disableAccount(accountId: string) {
    const account = await this.repository.findById(accountId);

    account.deletedAt = Date.now();
  }

  public async updateById(accountId: string, request: Request) {
    const { body, file, user } = request;

    authorize(user, accountId);

    let isAvatarUpdate: boolean;

    if (file) {
      body.avatar = file.filename;
      isAvatarUpdate = true;
    }
    if (body.password) {
      body.password = await Password.hash(body.password);
    }

    const updated = await this.repository.updateById(accountId, body);
    // TODO: inspect this
    Account.findOneAndUpdate(
      { _accountId: accountId, deletedAt: null },
      request.body,
      {
        returnDocument: "before",
      },
      function (error, oldAccount: IAccount | null) {
        if (error) throw error;
        if (oldAccount && isAvatarUpdate) {
          deletePhoto(oldAccount.avatar);
        }
      },
    );
  }
  // public async getAccountResumeById(accountId: string) {
  //   const resume = await this.resumeRepository.findByAccountId(accountId);
  //   if (!resume) {
  //     throw new NotFoundError(ResponseMessage.RESUME_NOT_FOUND);
  //   }

  //   return resume;
  // }
  // public async getAccountWorksById(accountId: string) {
  //   const works = await this.workRepository.findByAccountId(accountId);

  //   return works;
  // }
}
