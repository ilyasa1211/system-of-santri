import { Request, Response } from "express";
import LearningService from "../services/learning.service";
import Learning from "../models/learning.model";
import ApiResponse from "../utils/api-response";

export default class LearningController {
    private readonly learningService;
    private readonly apiResponse;

    public constructor() {
        this.learningService = new LearningService(Learning);
        this.apiResponse = ApiResponse;
    }
    public async index(request: Request, response: Response) {
        const learnings = await this.learningService.getAllLearning();
        return new this.apiResponse(response).ok({ learnings });
    }
    public async show(request: Request, response: Response) {
        const { id } = request.params;
        const learning = await this.learningService.getLearningById(id);
        return new this.apiResponse(response).ok({ learning });
    }
    public async insert(request: Request, response: Response) {
        const learning = await this.learningService.createNewLearning(request);
        return new this.apiResponse(response).created({ learning });
    }
    public async update(request: Request, response: Response) {
        const { id } = request.params;
        await this.learningService.updateLearningById(id, request);

        return new this.apiResponse(response).updated(null, false);
    }
    public async destroy(request: Request, response: Response) {
        const { id } = request.params;

        await this.learningService.deleteLearningById(id);

        return new this.apiResponse(response).deleted(null, false);
    }
}
