export default class EventRepository {
    constructor(eventModel) {
        this.eventModel = eventModel;
    }
    findAll() {
        return this.eventModel.find().exec();
    }
    insert(data) {
        return this.eventModel.create(data);
    }
    updateById(id, data) {
        return this.eventModel.findByIdAndUpdate(id, data).exec();
    }
    isExist(id) {
        return this.eventModel.exists({ _id: id }).exec();
    }
    deleteById(id) {
        return this.eventModel.findByIdAndDelete(id).exec();
    }
}
