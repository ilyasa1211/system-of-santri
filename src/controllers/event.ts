import { Request, Response } from "express";
import Event from "../models/event.model";
import ApiResponse from "../utils/api-response";

export class EventController {
  public constructor(
    private service: EventService,
    private apiResponse: ApiResponse,
  ) {}

  public async calendar(request: Request) {
    const year: number = new Date().getFullYear();
    const calendar = await this.service.getEventCalendar(year);

    return this.apiResponse.ok({ calendar });
  }
  public async index(request: Request) {
    const events = await this.service.getAllEvents();

    return this.apiResponse.created({ events });
  }
  public async insert(request: Request) {
    const event = await this.service.createNewEvent(request);

    return this.apiResponse.ok({ event });
  }
  public async update(request: Request) {
    const { id } = request.params;
    const event = await this.service.updateEventById(id, request);

    return this.apiResponse.updated(event);
  }
  public async destroy(request: Request) {
    const { id } = request.params;
    const deletedEvent = await this.service.deleteEventById(id);

    return this.apiResponse.deleted(deletedEvent);
  }
}
