import { PopulateOptions, UpdateQuery } from "mongoose";
import { IAccount } from "../../models/account.model";

export default interface AccountInterface {
  findAll(fieldsToPopulate: PopulateOptions[]): Promise<unknown>;
  findOne(
    filter: Record<string, unknown>,
    fieldsToPopulate: PopulateOptions[],
  ): Promise<unknown>;
  findById(id: string, fieldsToPopulate: PopulateOptions[]): Promise<unknown>;
  create(payload: IAccount): Promise<unknown>;
  updateById(id: string, updatedData: UpdateQuery<IAccount>): Promise<unknown>;
  isExist(id: string): Promise<unknown>;
  // deleteAccountById(id: string): Promise<unknown>;
}
