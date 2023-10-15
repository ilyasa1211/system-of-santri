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
import { NotFoundError } from "../enums/errors";
import { deletePhoto } from "../utils/delete-photo";
import { TAccount } from "../types/account";

export default class AccountService {
    private accountRepository;
    private resumeRepository;
    private workRepository;
    private options;

    public constructor(
        accountModel: typeof Account,
        resumeModel: typeof Resume,
        workModel: typeof Work,
    ) {
        this.accountRepository = new AccountRepository(accountModel);
        this.resumeRepository = new ResumeRepository(resumeModel);
        this.workRepository = new WorkRepository(workModel);
        this.options = getPopulationOptionsFromRequestQuery;
    }

    public getAllAccounts(query: Request["query"]) {
        const fieldsToPopulate = this.options(query);
        return this.accountRepository.findAll(fieldsToPopulate);
    }

    public getDisabledAccounts(query: Request["query"]) {
        const fieldsToPopulate = this.options(query);
        return this.accountRepository.findOne(
            { deletedAt: { $ne: null } },
            fieldsToPopulate,
        );
    }

    public async restoreDisabledAccountById(
        accountId: string,
        request: Request,
    ) {
        const account = await this.accountRepository.isExist(accountId);
        if (!account) {
            throw new NotFoundError(ResponseMessage.ACCOUNT_NOT_FOUND);
        }
        authorize(request.user, account._id.toString());
        return this.accountRepository.updateById(accountId, {
            deletedAt: null,
        });
    }

    public async deleteAccountById(accountId: string, user: TAccount) {
        const account = await this.accountRepository.findById(accountId);
        if (!account) {
            throw new NotFoundError(ResponseMessage.ACCOUNT_NOT_FOUND);
        }
        authorize(user, user.id);

        const deleted = await user.deleteOne();
        // eslint-disable-next-line no-debugger
        debugger;
        throw deleted;
        deletePhoto(user.avatar);

        return deleted;
    }

    public createNewAccount(request: Request) {
        const { file } = request;

        const data = Object.assign({}, request.body, {
            verify: true,
            password: Password.hash(request.body.password),
            avatar: file ? file.filename : undefined,
        });

        return this.accountRepository.insert(data);
    }

    public getAccountById(accountId: string, query: Request["query"]) {
        const fieldsToPopulate = this.options(query);
        const account = this.accountRepository.findById(
            accountId,
            fieldsToPopulate,
        );
        if (!account) {
            throw new NotFoundError(ResponseMessage.ACCOUNT_NOT_FOUND);
        }

        return account;
    }
    public async disableAccountById(accountId: string, request: Request) {
        authorize(request.user, accountId);
        const disabledAccount = this.accountRepository.disableById(accountId);
        return disabledAccount;
    }
    public async updateAccountById(accountId: string, request: Request) {
        const { body, file, user } = request;
        authorize(user, accountId);

        let isAvatarUpdate: boolean = false;

        if (file) {
            body.avatar = file.filename;
            isAvatarUpdate = true;
        }
        if (body.password) {
            body.password = await Password.hash(body.password);
        }

        const a = this.accountRepository.updateById(accountId, body);
        throw a;
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
    public async getAccountResumeById(accountId: string) {
        const resume = await this.resumeRepository.findByAccountId(accountId);
        if (!resume) {
            throw new NotFoundError(ResponseMessage.RESUME_NOT_FOUND);
        }

        return resume;
    }
    public async getAccountWorksById(accountId: string) {
        const works = await this.workRepository.findByAccountId(accountId);

        return works;
    }
}
