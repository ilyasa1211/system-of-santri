import { Request } from "express";
import ResumeRepository from "../repositories/resume.repository";
import ApiResponse from "../utils/api-response";

    export class ResumeController {
        public constructor(
            private readonly resumeRepository: ResumeRepository,
            private readonly apiResponse: ApiResponse,
        ) { }

        public async index(request: Request) {
            const resumes = await this.resumeRepository.findAll();

            return this.apiResponse.ok({ resumes });
        }

        public async show(request: Request, resumeId: string) {
            const resume = await this.resumeRepository.findById(resumeId);

            return this.apiResponse.ok({ resume });
        }

        public async insert(request: Request) {
            const resume = this.resumeRepository.insert(request.body);

            return this.apiResponse.created(resume);
        }

        public async update(request: Request, resumeId: string) {
            await this.resumeRepository.updateById(resumeId, request.body);

            return this.apiResponse.updated(null);
        }

        public async destroy(request: Request, resumeId: string) {
            await this.resumeRepository.deleteById(resumeId);

            return this.apiResponse.deleted(null);
        }
    }
