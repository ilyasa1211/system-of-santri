import { PopulateOptions } from "mongoose";

export default interface AccountInterface {
    findAll(fieldsToPopulate: PopulateOptions[]): any;
    findOne(
        filter: Record<string, any>,
        fieldsToPopulate: PopulateOptions[],
    ): any;
    findById(id: string, fieldsToPopulate: PopulateOptions[]): any;
    insert(data: Record<string, any>): any;
    updateById(id: string, updatedData: Record<string, any>): any;
    disableById(id: string): any;
    isExist(id: string): any;
    // deleteAccountById(id: string): any;
}
