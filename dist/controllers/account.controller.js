import Token from "../helpers/token";
import AccountService from "../services/account.service";
import Account from "../models/account.model";
import Resume from "../models/resume.model";
import Work from "../models/work.model";
import ApiResponse from "../utils/api-response";
import { ResponseMessage } from "../enums/response";
export default class AccountController {
    constructor() {
        this.accountService = new AccountService(Account, Resume, Work);
        this.apiResponse = ApiResponse;
    }
    async index(request, response) {
        const accounts = await this.accountService.getAllAccounts(request);
        return new this.apiResponse(response).ok({ accounts });
    }
    async create(request, response) {
        const account = await this.accountService.createNewAccount(request);
        const token = Token.generateJwtToken(account);
        return new this.apiResponse(response).created({ token });
    }
    async show(request, response) {
        const account = await this.accountService.getAccountById(request.params.id, request);
        return new this.apiResponse(response).ok({ account });
    }
    async update(request, response) {
        await this.accountService.updateAccountById(request.params.id, request);
        return new this.apiResponse(response).ok({
            message: ResponseMessage.ACCOUNT_UPDATED,
        });
    }
    async disableAccount(request, response) {
        await this.accountService.disableAccountById(request.params.id, request);
        return new this.apiResponse(response).ok({
            message: ResponseMessage.ACCOUNT_DELETED,
        });
    }
    async trash(request, response) {
        const accounts = await this.accountService.getDisabledAccounts(request);
        return new this.apiResponse(response).ok({ accounts });
    }
    async restore(request, response) {
        const { id: accountId } = request.params;
        await this.accountService.restoreDisabledAccountById(accountId, request);
        return new this.apiResponse(response).ok({
            message: ResponseMessage.ACCOUNT_RESTORED,
        });
    }
    async eliminate(request, response) {
        const { id: accountId } = request.params;
        await this.accountService.deleteAccountById(accountId, request);
        return new this.apiResponse(response).ok({
            message: ResponseMessage.ACCOUNT_DELETED_PERMANENT,
        });
    }
    async myAccount(request, response) {
        const { id: accountId } = request.user;
        const account = await this.accountService.getAccountById(accountId, request);
        return new this.apiResponse(response).ok({ account });
    }
    async showWorks(request, response) {
        const { id: accountId } = request.params;
        const works = await this.accountService.getAccountWorksById(accountId);
        return new this.apiResponse(response).ok({ works });
    }
    async showResume(request, response) {
        const { id: accountId } = request.params;
        const resume = await this.accountService.getAccountResumeById(accountId);
        return new this.apiResponse(response).ok({ resume });
    }
}
