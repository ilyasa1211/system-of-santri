import { Request, Response } from "express";
import EventService from "../services/event.service";
import Event from "../models/event.model";
import ApiResponse from "../utils/api-response";
import Calendar from "../models/calendar.model";

export default class EventController {
    private eventService;
    private apiResponse;

    public constructor() {
        this.eventService = new EventService(Event, Calendar);
        this.apiResponse = ApiResponse;
    }
    public async calendar(_request: Request, response: Response) {
        const year: number = new Date().getFullYear();
        const calendar = await this.eventService.getEventCalendar(year);

        return new this.apiResponse(response).ok({ calendar });
    }
    public async index(_request: Request, response: Response) {
        const events = await this.eventService.getAllEvents();

        return new this.apiResponse(response).created({ events });
    }
    public async insert(request: Request, response: Response) {
        const event = await this.eventService.createNewEvent(request);

        return new this.apiResponse(response).ok({ event });
    }
    public async update(request: Request, response: Response) {
        const { id } = request.params;
        const event = await this.eventService.updateEventById(id, request);

        return new this.apiResponse(response).updated(event, false);
    }
    public async destroy(request: Request, response: Response) {
        const { id } = request.params;
        const deletedEvent = await this.eventService.deleteEventById(id);

        return new this.apiResponse(response).deleted(deletedEvent, false);
    }
}
