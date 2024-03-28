import { PopulateOptions } from "mongoose";
import Account from "../models/account.model";
import AccountInterface from "./interfaces/account.interface";

export default class AccountRepository implements AccountInterface {
    public constructor(private accountModel: typeof Account) {}

    public async findAll(fieldsToPopulate: PopulateOptions[]) {
        return await this.accountModel
            .find({ deletedAt: null })
            .populate(fieldsToPopulate)
            .exec();
    }

    public async findOne(
        filter: Record<string, unknown>,
        fieldsToPopulate: PopulateOptions[],
    ) {
        return await this.accountModel
            .findOne(filter)
            .populate(fieldsToPopulate)
            .exec();
    }

    public async findById(id: string, fieldsToPopulate: PopulateOptions[] = []) {
        return await this.accountModel
            .find({ _id: id })
            .populate(fieldsToPopulate)
            .exec();
    }

    public async insert(data: Record<string, unknown>) {
        return await this.accountModel.create(data);
    }

    public async updateById(id: string, updatedData: Record<string, unknown>) {
        return await this.accountModel
            .findOneAndUpdate({ _id: id, deletedAt: null }, updatedData)
            .exec();
    }

    public async disableById(id: string) {
        return await this.accountModel
            .findOneAndUpdate(
                { _id: id, deletedAt: null },
                { deletedAt: Date.now() },
            )
            .exec();
    }
    public async isExist(id: string) {
        return await this.accountModel.exists({ _id: id }).exec();
    }
}
