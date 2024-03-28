import { Request } from "express";
import ResumeRepository from "../repositories/resume.repository";
import Resume from "../models/resume.model";
import { ConflictError, NotFoundError } from "../errors/errors";
import { ResponseMessage } from "../enums/response";
import { IAccount } from "../models/account.model";
import authorize from "../utils/authorize";
import { HydratedDocument<IAccount> } from "../types/account";

export default class ResumeService {
    private resumeRepository;
    public constructor(resumeModel: typeof Resume) {
        this.resumeRepository = new ResumeRepository(resumeModel);
    }
    public getAllResumes() {
        return this.resumeRepository.findAll();
    }

    public getResumeById(id: string) {
        const resume = this.resumeRepository.findById(id);

        if (!resume) {
            throw new NotFoundError(ResponseMessage.RESUME_NOT_FOUND);
        }
    }

    public async createNewResume(request: Request) {
        const { id: accountId } = request.user as HydratedDocument<IAccount>;

        const isExist = await this.resumeRepository.isExist({ accountId });

        if (isExist) {
            throw new ConflictError(ResponseMessage.RESUME_CONFLICT);
        }

        request.body.accountId = accountId;

        return this.resumeRepository.insert(request.body);
    }

    public async updateResumeById(id: string, payload: Request["body"], user: HydratedDocument<IAccount>) {
        const resume = await this.resumeRepository.findById(id);
        if (!resume) {
            throw new NotFoundError(ResponseMessage.RESUME_NOT_FOUND);
        }

        authorize(user, resume.accountId.toString());

        Object.assign(resume, payload);

        await resume.save();

        return resume;
    }
    public async deleteResumeById(id: string, user: HydratedDocument<IAccount>) {
        const resume = await this.resumeRepository.findById(id);
        if (!resume) {
            throw new NotFoundError(ResponseMessage.RESUME_NOT_FOUND);
        }

        authorize(user, resume.accountId.toString());

        return resume.deleteOne();
    }
}
