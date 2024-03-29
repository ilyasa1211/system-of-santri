import { Request } from "express";
import AccountService from "../services/account.service";
import { IAccount } from "../models/account.model";
import ApiResponse from "../utils/api-response";
import { ResponseMessage } from "../enums/response";
import { HydratedDocument } from "mongoose";
import Token from "../helpers/token";

export class AccountController {
  public constructor(
    private service: AccountService,
    private apiResponse: ApiResponse,
  ) {}

  public async index(request: Request) {
    const accounts = await this.service.getAllAccounts(request.query);

    return this.apiResponse.ok({ accounts });
  }
  
  public async create(request: Request) {
    const account = await this.service.create(request.body, request.file);
    const token = Token.generateJwtToken(account);

    return this.apiResponse.created({ token });
  }

  public async show(request: Request) {
    const accountId = request.params.accountId;

    const account = await this.service.findById(accountId, request.body);

    return this.apiResponse.ok({ account });
  }

  public async update(request: Request) {
    await this.service.updateById(request.params.id, request.body);

    return this.apiResponse.updated(null);
  }

  public async disable(request: Request) {
    const accountId = request.params.accountId;

    await this.service.disableAccount(accountId);

    return this.apiResponse.deleted(null);
  }

  // public async trash(request: Request) {
  //   const accounts = await this.service.getDisabledAccounts(
  //     request.query,
  //   );
  //   return this.apiResponse.ok({ accounts });
  // }

  public async restore(request: Request) {
    const { accountId } = request.params;
    await this.service.restoreAccount(accountId, request.body);

    return this.apiResponse.ok({
      message: ResponseMessage.ACCOUNT_RESTORED,
    });
  }

  public async destroy(request: Request) {
    const accountId = request.params.accountId;
    const user = request.user as HydratedDocument<IAccount>;

    await this.service.deleteById(accountId, user);

    return this.apiResponse.deleted(null);
  }

  // public async showWorks(request: Request) {
  //   const accountId = request.params.accountId;

  //   const works = await this.service.getAccountWorksById(accountId);

  //   return this.apiResponse.ok({ works });
  // }

  // public async showResume(request: Request) {
  //   const accountId = request.params.accountId;

  //   const resume = await this.service.getAccountResumeById(accountId);

  //   return this.apiResponse.ok({ resume });
  // }
}
