import { Request, Response } from "express";
import Token from "../helpers/token";
import AccountService from "../services/account.service";
import Account from "../models/account.model";
import Resume from "../models/resume.model";
import Work from "../models/work.model";
import ApiResponse from "../utils/api-response";
import { ResponseMessage } from "../enums/response";
import { TAccount } from "../types/account";

export default class AccountController {
    private accountService: AccountService;
    private apiResponse;

    public constructor() {
        this.accountService = new AccountService(Account, Resume, Work);
        this.apiResponse = ApiResponse;
    }

    public async index(request: Request, response: Response) {
        const accounts = await this.accountService.getAllAccounts(
            request.query,
        );

        return new this.apiResponse(response).ok({ accounts });
    }
    public async create(request: Request, response: Response) {
        const account = await this.accountService.createNewAccount(request);
        const token = Token.generateJwtToken(account);

        return new this.apiResponse(response).created({ token });
    }
    public async show(request: Request, response: Response) {
        const { accountId } = request.params;

        const account = await this.accountService.getAccountById(
            accountId,
            request.body,
        );

        return new this.apiResponse(response).ok({ account });
    }
    public async update(request: Request, response: Response) {
        await this.accountService.updateAccountById(request.params.id, request);

        return new this.apiResponse(response).updated(null, false);
    }
    public async disableAccount(request: Request, response: Response) {
        await this.accountService.disableAccountById(
            request.params.id,
            request,
        );

        return new this.apiResponse(response).deleted(null, false);
    }
    public async trash(request: Request, response: Response) {
        const accounts = await this.accountService.getDisabledAccounts(
            request.query,
        );
        return new this.apiResponse(response).ok({ accounts });
    }
    public async restore(request: Request, response: Response) {
        const { id: accountId }: { id?: string } = request.params;
        await this.accountService.restoreDisabledAccountById(
            accountId,
            request,
        );

        return new this.apiResponse(response).ok({
            message: ResponseMessage.ACCOUNT_RESTORED,
        });
    }
    public async eliminate(request: Request, response: Response) {
        const { id: accountId } = request.params;
        await this.accountService.deleteAccountById(
            accountId,
            request.user as TAccount,
        );

        return new this.apiResponse(response).deleted(null, false);
    }
    public async myAccount(request: Request, response: Response) {
        const { id: accountId } = request.user as TAccount;
        const account = await this.accountService.getAccountById(
            accountId as string,
            request.body,
        );

        return new this.apiResponse(response).ok({ account });
    }
    public async showWorks(request: Request, response: Response) {
        const { id: accountId } = request.params;
        const works = await this.accountService.getAccountWorksById(accountId);

        return new this.apiResponse(response).ok({ works });
    }
    public async showResume(request: Request, response: Response) {
        const { id: accountId } = request.params;
        const resume = await this.accountService.getAccountResumeById(
            accountId,
        );

        return new this.apiResponse(response).ok({ resume });
    }
}
