import { AnyKeys, UpdateQuery } from "mongoose";
import { IWork } from "../../models/work.model";
import { FilterQuery } from "mongoose";

export default interface ResumeInterface {
    findAll(): any;
    findById(id: string): any;
    findByAccountId(id: string): any;
    insert(data: AnyKeys<IWork>): any;
    updateById(id: string, updatedData: UpdateQuery<IWork>): any;
    deleteById(id: string): any;
    isExist(filter: FilterQuery<IWork>): any
}
