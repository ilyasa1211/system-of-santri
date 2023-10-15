export default class ResumeRepository {
    constructor(resumeModel) {
        this.resumeModel = resumeModel;
    }
    findAll() {
        return this.resumeModel.find().exec();
    }
    findById(id) {
        return this.resumeModel.findById(id).exec();
    }
    findByAccountId(id) {
        return this.resumeModel.findOne({ accountId: id }).exec();
    }
    insert(data) {
        return this.resumeModel.create(data);
    }
    updateById(id, updatedData) {
        return this.resumeModel.findByIdAndUpdate(updatedData).exec();
    }
    deleteById(id) {
        return this.resumeModel.findByIdAndDelete(id).exec();
    }
    isExist(filter) {
        return this.resumeModel.exists(filter).exec();
    }
}
