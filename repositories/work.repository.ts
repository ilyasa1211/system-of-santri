import { AnyKeys, FilterQuery, UpdateQuery } from "mongoose";
import Work, { IWork } from "../models/work.model";
import WorkInterface from "./interfaces/work.interface";

export default class WorkRepository implements WorkInterface {
    public constructor(private workModel: typeof Work) {}

    public findAll() {
        return this.workModel.find().exec();
    }

    public findById(id: string) {
        return this.workModel.findById(id).exec();
    }

    public findByAccountId(id: string) {
        return this.workModel.findOne({ accountId: id }).exec();
    }

    public findOne(filter: FilterQuery<IWork>) {
        return this.workModel.findOne(filter).exec();
    }

    public insert(data: AnyKeys<IWork>) {
        return this.workModel.create(data);
    }

    public updateById(id: string, updatedData: UpdateQuery<IWork>) {
        return this.workModel.findByIdAndUpdate(id, updatedData).exec();
    }

    public deleteById(id: string) {
        return this.workModel.findByIdAndDelete(id).exec();
    }
}
