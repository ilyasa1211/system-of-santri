import { AnyKeys, FilterQuery, UpdateQuery } from "mongoose";
import { ILearning } from "../../models/learning.model";

export default interface LearningInterface {
    findAll(): any;
    findOne(filter: FilterQuery<ILearning>): any;
    findById(id: string): any;
    findByAccountId(id: string): any;
    insert(data: AnyKeys<ILearning>): any;
    updateById(id: string, updatedData: UpdateQuery<ILearning>): any;
    deleteById(id: string): any;
}
