import { PopulateOptions, UpdateQuery } from "mongoose";
import Account, { IAccount } from "../models/account.model";
import AccountInterface from "./interfaces/account.interface";

export default class AccountRepository implements AccountInterface {
  public constructor(private model: typeof Account) {}

  public findAll(fieldsToPopulate: PopulateOptions[]) {
    return this.model.find().populate(fieldsToPopulate).exec();
  }

  public findOne(
    filter: Record<string, unknown>,
    fieldsToPopulate: PopulateOptions[],
  ) {
    return this.model.findOne(filter).populate(fieldsToPopulate).exec();
  }

  public findById(id: string, fieldsToPopulate: PopulateOptions[] = []) {
    return this.model.find({ _id: id }).populate(fieldsToPopulate).exec();
  }

  public create(payload: IAccount) {
    return this.model.create(payload);
  }

  public updateById(id: string, updatedData: UpdateQuery<IAccount>) {
    return this.model
      .findOneAndUpdate({ _id: id, deletedAt: null }, updatedData)
      .exec();
  }
  public isExist(id: string) {
    return this.model.exists({ _id: id }).exec();
  }
}
