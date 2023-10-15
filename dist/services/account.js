"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_1 = __importDefault(require("../repositories/account"));
const get_population_options_from_request_query_1 = require("../utils/get-population-options-from-request-query");
const password_1 = __importDefault(require("../helpers/password"));
class AccountService {
    constructor() {
        this.accountRepository = new account_1.default();
    }
    getAllAccount(request) {
        const fieldsToPopulate = (0, get_population_options_from_request_query_1.getPopulationOptionsFromRequestQuery)(request);
        return this.accountRepository.all(fieldsToPopulate);
    }
    insertAccount(request) {
        const { file } = request;
        const requestBody = Object.assign({}, request.body, {
            verify: true,
            password: password_1.default.hash(request.body.password),
            avatar: file ? file.filename : undefined,
        });
        return this.accountRepository.create(requestBody);
    }
    getAccountById(id) {
        return (request) => {
            const fieldsToPopulate = (0, get_population_options_from_request_query_1.getPopulationOptionsFromRequestQuery)(request);
            return this.accountRepository.getById(id, fieldsToPopulate);
        };
    }
}
exports.default = AccountService;
