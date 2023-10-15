export default class LearningRepository {
    constructor(learningModel) {
        this.learningModel = learningModel;
    }
    findAll() {
        return this.learningModel.find().exec();
    }
    findById(id) {
        return this.learningModel.findById(id).exec();
    }
    findByAccountId(id) {
        return this.learningModel.findOne({ accountId: id }).exec();
    }
    findOne(filter) {
        return this.learningModel.findOne(filter).exec();
    }
    insert(data) {
        return this.learningModel.create(data);
    }
    updateById(id, updatedData) {
        return this.learningModel.findByIdAndUpdate(id, updatedData).exec();
    }
    deleteById(id) {
        return this.learningModel.findByIdAndDelete(id).exec();
    }
}
