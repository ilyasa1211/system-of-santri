import { AnyKeys, FilterQuery, UpdateQuery } from "mongoose";
import { IWork } from "../../models/work.model";

export default interface WorkInterface {
    findAll(): any;
    findOne(filter: FilterQuery<IWork>): any;
    findById(id: string): any;
    findByAccountId(id: string): any;
    insert(data: AnyKeys<IWork>): any;
    updateById(id: string, updatedData: UpdateQuery<IWork>): any;
    deleteById(id: string): any;
}
