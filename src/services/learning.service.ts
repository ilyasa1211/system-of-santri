import { Request } from "express";
import { NotFoundError } from "../errors/errors";
import { ResponseMessage } from "../enums/response";
import Learning from "../models/learning.model";
import LearningRepository from "../repositories/learning.repository";
import { deletePhoto } from "../utils/delete-photo";

export default class LearningService {
    private learningRepository;

    public constructor(learningModel: typeof Learning) {
        this.learningRepository = new LearningRepository(learningModel);
    }
    public async getAllLearning() {
        const learnings = await this.learningRepository.findAll();
        return learnings;
    }
    public async getLearningById(learningId: string) {
        const learning = await this.learningRepository.findById(learningId);
        if (!learning) {
            throw new NotFoundError(ResponseMessage.LEARNING_NOT_FOUND);
        }
        return learning;
    }
    public async createNewLearning(request: Request) {
        const { body, file } = request;
        !body.thumbnail && delete body.thumbnail;
        if (file) {
            const { path } = file;
            body.thumbnail = path.slice(path.indexOf("images"));
        }
        const learning = await this.learningRepository.insert(body);
        return learning;
    }
    public async updateLearningById(learningId: string, request: Request) {
        const { body, file } = request;
        if (file) {
            const { path } = file;
            body.thumbnail = path.slice(path.indexOf("images"));
        }
        const learning = await this.learningRepository.findById(learningId);
        if (!learning) {
            throw new NotFoundError(ResponseMessage.LEARNING_NOT_FOUND);
        }
        Object.assign(learning, body);
        await learning.save();
    }
    public async deleteLearningById(learningId: string) {
        const learning = await Learning.findById(learningId);
        if (!learning) {
            throw new NotFoundError(ResponseMessage.LEARNING_NOT_FOUND);
        }
        await learning.deleteOne();
        deletePhoto(learning.thumbnail);
    }
}
