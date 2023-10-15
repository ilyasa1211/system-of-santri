import { NotFoundError } from "../enums/errors";
import { ResponseMessage } from "../enums/response";
import Learning from "../models/learning.model";
import LearningRepository from "../repositories/learning.repository";
import { deletePhoto } from "../utils/delete-photo";
export default class LearningService {
    constructor(learningModel) {
        this.learningRepository = new LearningRepository(learningModel);
    }
    async getAllLearning() {
        const learnings = await this.learningRepository.findAll();
        return learnings;
    }
    async getLearningById(learningId) {
        const learning = await this.learningRepository.findById(learningId);
        if (!learning) {
            throw new NotFoundError(ResponseMessage.LEARNING_NOT_FOUND);
        }
        return learning;
    }
    async createNewLearning(request) {
        const { body, file } = request;
        !body.thumbnail && delete body.thumbnail;
        if (file) {
            const { path } = file;
            body.thumbnail = path.slice(path.indexOf("images"));
        }
        const learning = await this.learningRepository.insert(body);
        return learning;
    }
    async updateLearningById(learningId, request) {
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
    async deleteLearningById(learningId) {
        const learning = await Learning.findById(learningId);
        if (!learning) {
            throw new NotFoundError(ResponseMessage.LEARNING_NOT_FOUND);
        }
        await learning.deleteOne();
        deletePhoto(learning.thumbnail);
    }
}
