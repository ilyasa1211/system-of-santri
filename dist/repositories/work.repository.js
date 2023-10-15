export default class WorkRepository {
    constructor(workModel) {
        this.workModel = workModel;
    }
    findAll() {
        return this.workModel.find().exec();
    }
    findById(id) {
        return this.workModel.findById(id).exec();
    }
    findByAccountId(id) {
        return this.workModel.findOne({ accountId: id }).exec();
    }
    findOne(filter) {
        return this.workModel.findOne(filter).exec();
    }
    insert(data) {
        return this.workModel.create(data);
    }
    updateById(id, updatedData) {
        return this.workModel.findByIdAndUpdate(id, updatedData).exec();
    }
    deleteById(id) {
        return this.workModel.findByIdAndDelete(id).exec();
    }
}
