export default class AccountRepository {
    constructor(accountModel) {
        this.accountModel = accountModel;
        this.projection = [
            "absenceId",
            "absences",
            "avatar",
            "division",
            "email",
            "generation",
            "generationYear",
            "name",
            "phoneNumber",
            "roleId",
            "santriPeriod",
            "status",
            "workId",
        ];
    }
    findAll(fieldsToPopulate) {
        return this.accountModel
            .find({ deletedAt: null })
            .populate(fieldsToPopulate)
            .exec();
    }
    findOne(filter, fieldsToPopulate) {
        return this.accountModel
            .findOne(filter)
            .populate(fieldsToPopulate)
            .exec();
    }
    findById(id, fieldsToPopulate = []) {
        return this.accountModel
            .find({ _id: id })
            .populate(fieldsToPopulate)
            .exec();
    }
    insert(data) {
        return this.accountModel.create(data);
    }
    updateById(id, updatedData) {
        return this.accountModel
            .findOneAndUpdate({ _id: id, deletedAt: null }, updatedData)
            .exec();
    }
    disableById(id) {
        return this.accountModel
            .findOneAndUpdate({ _id: id, deletedAt: null }, { deletedAt: Date.now() })
            .exec();
    }
    isExist(id) {
        return this.accountModel.exists({ _id: id }).exec();
    }
}
