import { PopulateOptions } from "mongoose";

export default interface AccountInterface {
    findAll(fieldsToPopulate: PopulateOptions[]): Promise<unknown>;
    findOne(
        filter: Record<string, unknown>,
        fieldsToPopulate: PopulateOptions[],
    ): Promise<unknown>;
    findById(id: string, fieldsToPopulate: PopulateOptions[]): Promise<unknown>;
    insert(data: Record<string, unknown>): Promise<unknown>;
    updateById(id: string, updatedData: Record<string, unknown>): Promise<unknown>;
    disableById(id: string): Promise<unknown>;
    isExist(id: string): Promise<unknown>;
    // deleteAccountById(id: string): Promise<unknown>;
}
