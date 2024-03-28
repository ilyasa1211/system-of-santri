import Event from "../models/event.model";
import EventInterface from "./interfaces/event.interface";

export default class EventRepository implements EventInterface {
     public constructor(private eventModel: typeof Event) {}

     public async findAll() {
        return await this.eventModel.find().exec();
    }

     public async insert(data: Record<string, unknown>) {
        return await this.eventModel.create(data);
    }

     public async updateById(id: string, data: Record<string, unknown>) {
        return await this.eventModel.findByIdAndUpdate(id, data).exec();
    }

     public async isExist(id: string) {
        return await this.eventModel.exists({ _id: id }).exec();
    }

     public async deleteById(id: string) {
        return await this.eventModel.findByIdAndDelete(id).exec();
    }
}
