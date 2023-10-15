import Event from "../models/event.model";
import EventInterface from "./interfaces/event.interface";

export default class EventRepository implements EventInterface {
    public constructor(private eventModel: typeof Event) {}

    public findAll() {
        return this.eventModel.find().exec();
    }

    public insert(data: any) {
        return this.eventModel.create(data);
    }

    public updateById(id: string, data: any) {
        return this.eventModel.findByIdAndUpdate(id, data).exec();
    }

    public isExist(id: string) {
        return this.eventModel.exists({ _id: id }).exec();
    }

    public deleteById(id: string) {
        return this.eventModel.findByIdAndDelete(id).exec();
    }
}
