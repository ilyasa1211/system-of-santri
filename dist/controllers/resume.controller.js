import { StatusCodes } from "http-status-codes";
export default class ResumeController {
    async index(request, response) {
        return response.status(StatusCodes.OK).json({ resumes });
    }
    async show(request, response) {
        return response.status(StatusCodes.OK).json({ resume });
    }
    async insert(request, response) {
        return response.status(StatusCodes.OK).json({
            message: ResponseMessage.RESUME_CREATED,
            resume,
        });
    }
    async update(request, response) {
        return response.status(StatusCodes.OK).json({
            message: ResponseMessage.RESUME_UPDATED,
        });
    }
    async destroy(request, response) {
        return response.status(StatusCodes.OK).json({
            message: ResponseMessage.RESUME_DELETED,
        });
    }
}
