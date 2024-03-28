import { ILearning } from "../../models/learning.model";

export default interface LearningInterface {
    findAll(): Promise<unknown>;
    findOne(filter: Record<string, unknown>): Promise<unknown>;
    findById(id: string): Promise<unknown>;
    findByAccountId(id: string): Promise<unknown>;
    insert(data: Record<string, unknown>): Promise<unknown>;
    updateById(id: string, updatedData: Record<string, unknown>): Promise<unknown>;
    deleteById(id: string): Promise<unknown>;
}
