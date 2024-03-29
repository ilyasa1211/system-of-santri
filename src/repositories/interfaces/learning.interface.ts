import { FilterQuery, UpdateQuery } from "mongoose";
import { ILearning } from "../../models/learning.model";

export default interface LearningInterface {
    findAll(): Promise<unknown>;
    findOne(filter: FilterQuery<ILearning>): Promise<unknown>;
    findById(id: string): Promise<unknown>;
    findByAccountId(id: string): Promise<unknown>;
    create(payload: ILearning): Promise<unknown>;
    updateById(id: string, updatedData: UpdateQuery<ILearning>): Promise<unknown>;
    deleteById(id: string): Promise<unknown>;
}
