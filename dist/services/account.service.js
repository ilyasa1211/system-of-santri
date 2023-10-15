import { getPopulationOptionsFromRequestQuery } from "../utils/get-population-options-from-request-query";
import AccountRepository from "../repositories/account.repository";
import Password from "../helpers/password";
import Account from "../models/account.model";
import authorize from "../utils/authorize";
import ResumeRepository from "../repositories/resume.repository";
import WorkRepository from "../repositories/work.repository";
import { ResponseMessage } from "../enums/response";
import { NotFoundError } from "../enums/errors";
import { deletePhoto } from "../utils/delete-photo";
export default class AccountService {
    constructor(accountModel, resumeModel, workModel) {
        this.accountRepository = new AccountRepository(accountModel);
        this.resumeRepository = new ResumeRepository(resumeModel);
        this.workRepository = new WorkRepository(workModel);
        this.options = getPopulationOptionsFromRequestQuery;
    }
    getAllAccounts(request) {
        const fieldsToPopulate = this.options(request);
        return this.accountRepository.findAll(fieldsToPopulate);
    }
    getDisabledAccounts(request) {
        const fieldsToPopulate = this.options(request);
        return this.accountRepository.findOne({ deletedAt: { $ne: null } }, fieldsToPopulate);
    }
    async restoreDisabledAccountById(accountId, request) {
        const account = await this.accountRepository.isExist(accountId);
        if (!account) {
            throw new NotFoundError(ResponseMessage.ACCOUNT_NOT_FOUND);
        }
        authorize(request.user, account._id.toString());
        return this.accountRepository.updateById(accountId, {
            deletedAt: null,
        });
    }
    async deleteAccountById(accountId, user) {
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
    createNewAccount(request) {
        const { file } = request;
        const data = Object.assign({}, request.body, {
            verify: true,
            password: Password.hash(request.body.password),
            avatar: file ? file.filename : undefined,
        });
        return this.accountRepository.insert(data);
    }
    getAccountById(accountId, request) {
        const fieldsToPopulate = this.options(request);
        const account = this.accountRepository.findById(accountId, fieldsToPopulate);
        if (!account) {
            throw new NotFoundError(ResponseMessage.ACCOUNT_NOT_FOUND);
        }
        return account;
    }
    async disableAccountById(accountId, request) {
        authorize(request.user, accountId);
        const disabledAccount = this.accountRepository.disableById(accountId);
        return disabledAccount;
    }
    async updateAccountById(accountId, request) {
        const { body, file, user } = request;
        authorize(user, accountId);
        let isAvatarUpdate = false;
        if (file) {
            body.avatar = file.filename;
            isAvatarUpdate = true;
        }
        if (body.password) {
            body.password = await Password.hash(body.password);
        }
        const a = this.accountRepository.updateById(accountId, body);
        throw a;
        Account.findOneAndUpdate({ _accountId: accountId, deletedAt: null }, request.body, {
            returnDocument: "before",
        }, function (error, oldAccount) {
            if (error)
                throw error;
            if (oldAccount && isAvatarUpdate) {
                deletePhoto(oldAccount.avatar);
            }
        });
    }
    async getAccountResumeById(accountId) {
        const resume = await this.resumeRepository.findByAccountId(accountId);
        if (!resume) {
            throw new NotFoundError(ResponseMessage.RESUME_NOT_FOUND);
        }
        return resume;
    }
    async getAccountWorksById(accountId) {
        const works = await this.workRepository.findByAccountId(accountId);
        return works;
    }
}
