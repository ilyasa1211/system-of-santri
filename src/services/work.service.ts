import { Request } from "express";
import Work from "../models/work.model";
import WorkRepository from "../repositories/work.repository";
import { NotFoundError } from "../errors/errors";
import { ResponseMessage } from "../enums/response";
import { HydratedDocument<IAccount> } from "../types/account";
import authorize from "../utils/authorize";

export default class WorkService {
    private workRepository;

    public constructor(workModel: typeof Work) {
        this.workRepository = new WorkRepository(workModel);
    }

    public async getAllWorks() {
        const works = await Work.find().sort({ createdAt: "desc" });
        return works;
    }
    public async getWorkById(id: string) {
        const work = await this.workRepository.findById(id);
        if (!work) {
            throw new NotFoundError(ResponseMessage.WORK_NOT_FOUND);
        }
        return work;
    }
    public async createNewWork(payload: any, user: HydratedDocument<IAccount>) {
        payload.accountId = user.id;

        const work = await this.workRepository.insert(payload);
        user.workId.push(work.id);
        const updatedAccount = await user.save();

        return updatedAccount;
    }
    public async updateWorkById(id: string, payload: any, user: HydratedDocument<IAccount>) {
        const work = await this.workRepository.findById(id);

        if (!work) {
            throw new NotFoundError(ResponseMessage.WORK_NOT_FOUND);
        }
        Object.assign(work, payload);

        authorize(user, work.accountId.toString());
        const updatedWork = work.save();

        return updatedWork;
    }

    public async deleteWorkById(id: string, user: HydratedDocument<IAccount>) {
        const work = await Work.findById(id);
        if (!work) {
            throw new NotFoundError(ResponseMessage.WORK_NOT_FOUND);
        }

        authorize(user, work.accountId.toString());

        return work.deleteOne();
    }
}
