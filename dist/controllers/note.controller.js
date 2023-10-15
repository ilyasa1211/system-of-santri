import { StatusCodes } from "http-status-codes";
export default class NoteController {
    async index(request, response) {
        return response.status(StatusCodes.OK).json({ notes });
    }
    async show(request, response) {
        return response.status(StatusCodes.OK).json({ note });
    }
    async insert(request, response) {
        return response.status(StatusCodes.OK).json({
            message: ResponseMessage.NOTE_CREATED,
            notes,
        });
    }
    async update(request, response) {
        return response.status(StatusCodes.OK).json({
            message: ResponseMessage.NOTE_UPDATED,
            notes,
        });
    }
    async destroy(request, response) {
        return response.status(StatusCodes.OK).json({
            message: ResponseMessage.NOTE_DELETED,
            notes,
        });
    }
}
