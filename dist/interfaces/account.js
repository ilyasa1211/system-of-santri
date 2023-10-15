"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AccountInterface {
    constructor() {
        this.projection = [
            "name",
            "email",
            "phoneNumber",
            "division",
            "status",
            "avatar",
            "santriPeriod",
            "generation",
            "generationYear",
            "roleId",
            "workId",
            "absences",
            "absenceId",
        ];
    }
    all(fieldsToPopulate) { }
    getOne(id, fieldsToPopulate) { }
    getById(id, fieldsToPopulate) { }
    create(data) { }
    updateById(id, data) { }
    deleteById(id) { }
}
exports.default = AccountInterface;
