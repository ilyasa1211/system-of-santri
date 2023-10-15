import { PopulateOptions } from "mongoose";
import Account from "../models/account.model";
import AccountInterface from "./interfaces/account.interface";

export default class AccountRepository implements AccountInterface {
    protected readonly projection = [
        "absenceId",
        "absences",
        "avatar",
        "division",
        "email",
        "generation",
        "generationYear",
        "name",
        "phoneNumber",
        "roleId",
        "santriPeriod",
        "status",
        "workId",
    ];

    public constructor(private accountModel: typeof Account) {}

    public findAll(fieldsToPopulate: PopulateOptions[]) {
        return this.accountModel
            .find({ deletedAt: null })
            .populate(fieldsToPopulate)
            .exec();
    }

    public findOne(
        filter: Record<string, any>,
        fieldsToPopulate: PopulateOptions[],
    ) {
        return this.accountModel
            .findOne(filter)
            .populate(fieldsToPopulate)
            .exec();
    }

    public findById(id: string, fieldsToPopulate: PopulateOptions[] = []) {
        return this.accountModel
            .find({ _id: id })
            .populate(fieldsToPopulate)
            .exec();
    }

    public insert(data: Record<string, any>) {
        return this.accountModel.create(data);
    }

    public updateById(id: string, updatedData: Record<string, any>) {
        return this.accountModel
            .findOneAndUpdate({ _id: id, deletedAt: null }, updatedData)
            .exec();
    }

    public disableById(id: string) {
        return this.accountModel
            .findOneAndUpdate(
                { _id: id, deletedAt: null },
                { deletedAt: Date.now() },
            )
            .exec();
    }
    public isExist(id: string) {
        return this.accountModel.exists({ _id: id }).exec();
    }
}
