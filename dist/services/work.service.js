import Work from "../models/work.model";
import WorkRepository from "../repositories/work.repository";
import { NotFoundError } from "../enums/errors";
import { ResponseMessage } from "../enums/response";
export default class WorkService {
    constructor(workModel) {
        this.workRepository = new WorkRepository(workModel);
    }
    async getAllWorks() {
        const works = await Work.find().sort({ createdAt: "desc" });
        return works;
    }
    async getWorkById(id) {
        const work = await this.workRepository.findById(id);
        if (!work) {
            throw new NotFoundError(ResponseMessage.WORK_NOT_FOUND);
        }
        return work;
    }
    async createNewWork(payload, user) {
        payload.accountId = user.id;
        const work = await this.workRepository.insert(payload);
        user.workId.push(work.id);
        const updatedAccount = await user.save();
        return updatedAccount;
    }
    async updateWorkById(id, payload, user) {
        const work = await this.workRepository.findById(id);
        if (!work) {
            throw new NotFoundError(ResponseMessage.WORK_NOT_FOUND);
        }
        Object.assign(work, payload);
        authorize(user, work.accountId.toString());
        const updatedWork = work.save();
        return updatedWork;
    }
    async deleteWorkById(id, user) {
        const work = await Work.findById(id);
        if (!work) {
            throw new NotFoundError(ResponseMessage.WORK_NOT_FOUND);
        }
        authorize(user, work.accountId.toString());
        return work.deleteOne();
    }
}
