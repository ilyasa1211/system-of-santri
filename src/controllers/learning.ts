import { Request, Response } from "express";
import LearningService from "../services/learning.service";
import Learning from "../models/learning.model";
import ApiResponse from "../utils/api-response";

    export class LearningController {
        public constructor(
            private readonly learningService: LearningService,
            private readonly apiResponse: ApiResponse,
        ) { }

        public async index(request: Request) {
            const learnings = await this.learningService.getAllLearning();

            return this.apiResponse.ok({ learnings });
        }
        
        public async show(request: Request, learningId: string) {
            const learning = await this.learningService.getLearningById(id);

            return this.apiResponse.ok({ learning });
        }

        public async insert(request: Request) {
            const learning = await this.learningService.createNewLearning(request);

            return this.apiResponse.created({ learning });
        }

        public async update(request: Request, learningId: string) {
            await this.learningService.updateLearningById(learningId);

            return this.apiResponse.updated(null);
        }

        public async destroy(request: Request, learningId: string) {
            await this.learningService.deleteLearningById(learningId);

            return this.apiResponse.deleted(null);
        }
    }
