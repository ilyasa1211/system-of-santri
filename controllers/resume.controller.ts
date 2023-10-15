import { Request, Response } from "express";
import ResumeRepository from "../repositories/resume.repository";
import Resume from "../models/resume.model";
import ApiResponse from "../utils/api-response";

export default class ResumeController {
    private resumeRepository;
    private apiResponse;

    public constructor() {
        this.resumeRepository = new ResumeRepository(Resume);
        this.apiResponse = ApiResponse;
    }
    public async index(request: Request, response: Response) {
        const resumes = await this.resumeRepository.findAll();

        return new this.apiResponse(response).ok({ resumes });
    }

    public async show(request: Request, response: Response) {
        const { resumeId } = request.params;
        const resume = await this.resumeRepository.findById(resumeId);

        return new this.apiResponse(response).ok({ resume });
    }

    public async insert(request: Request, response: Response) {
        const resume = this.resumeRepository.insert(request.body);

        return new this.apiResponse(response).created(resume);
    }

    public async update(request: Request, response: Response) {
        const { resumeId } = request.params;
        await this.resumeRepository.updateById(resumeId, request.body);

        return new this.apiResponse(response).updated(null, false);
    }

    public async destroy(request: Request, response: Response) {
        const { resumeId } = request.params;

        await this.resumeRepository.deleteById(resumeId);

        return new this.apiResponse(response).deleted(null, false);
    }
}
