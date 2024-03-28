import { Request } from "express";
import AccountService from "../services/account.service";
import { IAccount } from "../models/account.model";
import ApiResponse from "../utils/api-response";
import { ResponseMessage } from "../enums/response";
import { HydratedDocument } from "mongoose";
import Token from "../helpers/token";

export class AccountController {
  public constructor(
    private accountService: AccountService,
    private apiResponse: ApiResponse,
  ) {}

  public async index(request: Request) {
    const accounts = await this.accountService.getAllAccounts(request.query);

    return this.apiResponse.ok({ accounts });
  }
  public async create(request: Request) {
    const account = await this.accountService.createNewAccount(request);
    const token = Token.generateJwtToken(account);

    return this.apiResponse.created({ token });
  }

  public async show(request: Request, accountId: string) {
    const account = await this.accountService.getAccountById(
      accountId,
      request.body,
    );

    return this.apiResponse.ok({ account });
  }

  public async update(request: Request) {
    await this.accountService.updateAccountById(request.params.id, request);

    return this.apiResponse.updated(null);
  }

  public async disable(request: Request, accountId: string) {
    await this.accountService.disableAccountById(accountId);

    return this.apiResponse.deleted(null);
  }

  // public async trash(request: Request) {
  //   const accounts = await this.accountService.getDisabledAccounts(
  //     request.query,
  //   );
  //   return this.apiResponse.ok({ accounts });
  // }

  public async restore(request: Request) {
    const { id: accountId }: { id?: string } = request.params;
    await this.accountService.restoreDisabledAccountById(accountId, request);

    return this.apiResponse.ok({
      message: ResponseMessage.ACCOUNT_RESTORED,
    });
  }

  public async destroy(request: Request, accountId: string) {
    await this.accountService.deleteAccountById(
      accountId,
      request.user as HydratedDocument<IAccount>,
    );

    return this.apiResponse.deleted(null);
  }

  public async showWorks(request: Request, accountId: string) {
    const works = await this.accountService.getAccountWorksById(accountId);

    return this.apiResponse.ok({ works });
  }
  
  public async showResume(request: Request, accountId: string) {
    const resume = await this.accountService.getAccountResumeById(accountId);

    return this.apiResponse.ok({ resume });
  }
}
