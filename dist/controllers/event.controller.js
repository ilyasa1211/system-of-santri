import { StatusCodes } from "http-status-codes";
import EventService from "../services/event.service";
import Event from "../models/event.model";
export default class EventController {
    constructor() {
        this.eventService = new EventService(Event);
    }
    async calendar(request, response) {
        const year = new Date().getFullYear();
        const calendar = await this.eventService.getEventCalendar(year);
        return response.status(StatusCodes.OK).json({ calendar });
    }
    async index(request, response) {
        const events = await this.eventService.getAllEvents();
        return response.status(StatusCodes.OK).json({ events });
    }
    async insert(request, response) {
        const event = await this.eventService.createNewEvent(request);
        return response.status(StatusCodes.CREATED).json({
            message: ResponseMessage.EVENT_CREATED,
        });
    }
    async update(request, response) {
        const { id } = request.params;
        const event = await this.eventService.updateEventById(id, request);
        return response.status(StatusCodes.OK).json({
            message: ResponseMessage.EVENT_UPDATED,
        });
    }
    async destroy(request, response) {
        const { id } = request.params;
        const deleted = await this.eventService.deleteEventById(id);
        return response.status(StatusCodes.OK).json({
            message: ResponseMessage.EVENT_UPDATED,
        });
    }
}
