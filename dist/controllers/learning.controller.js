import { StatusCodes } from "http-status-codes";
export default class LearningController {
    constructor() {
        this.learningService = new LearningService();
    }
    async index(request, response) {
        return response.status(StatusCodes.OK).json({ learnings });
    }
    async show(request, response) {
        const { id } = request.params;
        return response.status(StatusCodes.OK).json({ learning });
    }
    async insert(request, response) {
        const { body, file } = request;
        return response.status(StatusCodes.OK).json({
            message: ResponseMessage.LEARNING_CREATED,
        });
    }
    async update(request, response) {
        const { body, file, params } = request;
        const { id } = params;
        return response.status(StatusCodes.OK).json({
            message: ResponseMessage.LEARNING_UPDATED,
        });
    }
    async destroy(request, response) {
        const { id } = request.params;
        return response.status(StatusCodes.OK).json({
            message: ResponseMessage.LEARNING_DELETED,
        });
    }
}
