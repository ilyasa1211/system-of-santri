"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_1 = __importDefault(require("../interfaces/account"));
const models_1 = require("../models");
class AccountRepository extends account_1.default {
    all(fieldsToPopulate) {
        return models_1.Account.find({ deletedAt: null, verify: true })
            .select(this.projection)
            .populate(fieldsToPopulate)
            .exec();
    }
    create(data) {
        return models_1.Account.create(data);
    }
    getById(id, fieldsToPopulate) {
        return models_1.Account.findOne({
            _id: id,
            deletedAt: null,
            verify: true,
        })
            .select(this.projection)
            .populate(fieldsToPopulate)
            .exec();
    }
}
exports.default = AccountRepository;
