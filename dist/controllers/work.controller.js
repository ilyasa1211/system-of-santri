import { StatusCodes } from "http-status-codes";
export default class WorkController {
    async index(request, response) {
        return response.status(StatusCodes.OK).json({ works });
    }
    async show(request, response) {
        const { id } = request.params;
        return response.status(StatusCodes.OK).json({ work });
    }
    async insert(request, response) {
        const user = request.user;
        return response.status(StatusCodes.OK).json({
            message: ResponseMessage.WORK_CREATED,
            work,
        });
    }
    async update(request, response) {
        return response.status(StatusCodes.OK).json({
            message: ResponseMessage.WORK_UPDATED,
        });
    }
    async destroy(request, response) {
        return response.status(StatusCodes.OK).json({
            message: ResponseMessage.WORK_DELETED,
        });
    }
}
