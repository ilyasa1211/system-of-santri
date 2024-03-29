import { Model } from "mongoose";
import Event, { IEvent } from "../models/event.model";
import EventInterface from "./interfaces/event.interface";

export default class EventRepository implements EventInterface {
     public constructor(private model: Model<IEvent>) {}

     public async findAll() {
        return await this.model.find().exec();
    }

     public async insert(data: Record<string, unknown>) {
        return await this.model.create(data);
    }

     public async updateById(id: string, data: Record<string, unknown>) {
        return await this.model.findByIdAndUpdate(id, data).exec();
    }

     public async isExist(id: string) {
        return await this.model.exists({ _id: id }).exec();
    }

     public async deleteById(id: string) {
        return await this.model.findByIdAndDelete(id).exec();
    }
}
