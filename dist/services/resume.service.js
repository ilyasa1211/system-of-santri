import ResumeRepository from "../repositories/resume.repository";
import { ConflictError, NotFoundError } from "../enums/errors";
import { ResponseMessage } from "../enums/response";
import authorize from "../utils/authorize";
export default class ResumeService {
    constructor(resumeModel) {
        this.resumeRepository = new ResumeRepository(resumeModel);
    }
    getAllResumes() {
        return this.resumeRepository.findAll();
    }
    getResumeById(id) {
        const resume = this.resumeRepository.findById(id);
        if (!resume) {
            throw new NotFoundError(ResponseMessage.RESUME_NOT_FOUND);
        }
    }
    async createNewResume(request) {
        const { id: accountId } = request.user;
        const isExist = await this.resumeRepository.isExist({ accountId });
        if (isExist) {
            throw new ConflictError(ResponseMessage.RESUME_CONFLICT);
        }
        request.body.accountId = accountId;
        return this.resumeRepository.insert(request.body);
    }
    async updateResumeById(id, request) {
        const resume = await this.resumeRepository.findById(id);
        if (!resume) {
            throw new NotFoundError(ResponseMessage.RESUME_NOT_FOUND);
        }
        authorize(request.user, resume.accountId.toString());
        Object.assign(resume, request.body);
        await resume.save();
        return resume;
    }
    async deleteResumeById(id, request) {
        const { user } = request;
        const resume = await this.resumeRepository.findById(id);
        if (!resume) {
            throw new NotFoundError(ResponseMessage.RESUME_NOT_FOUND);
        }
        authorize(user, resume.accountId.toString());
        return resume.deleteOne();
    }
}
