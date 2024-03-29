import { Request, Response } from "express";
import LearningService from "../services/learning.service";
import Learning from "../models/learning.model";
import ApiResponse from "../utils/api-response";

export class LearningController {
  public constructor(
    private readonly service: LearningService,
    private readonly apiResponse: ApiResponse,
  ) {}

  public async index(request: Request) {
    const learnings = await this.service.getAllLearning();

    return this.apiResponse.ok({ learnings });
  }

  public async show(request: Request) {
    const learningId: string = request.params.learningId;

    const learning = await this.service.getLearningById(learningId);

    return this.apiResponse.ok({ learning });
  }

  public async store(request: Request) {
    const learning = await this.service.createNewLearning(request);

    return this.apiResponse.created({ learning });
  }

  public async update(request: Request) {
    const learningId: string = request.params.learningId;

    await this.service.updateLearningById(learningId, request.body);

    return this.apiResponse.updated(null);
  }

  public async destroy(request: Request) {
    const learningId: string = request.params.learningId;
    // TODO: Add authorization
    await this.service.deleteLearningById(learningId);

    return this.apiResponse.deleted(null);
  }
}
