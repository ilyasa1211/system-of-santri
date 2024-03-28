import { Request, Response } from "express";
import EventService from "../services/event.service";
import Event from "../models/event.model";
import ApiResponse from "../utils/api-response";

    export class EventController {
        public constructor(
            private eventService: EventService,
            private apiResponse: ApiResponse,
        ) { }

        public async calendar(_request: Request) {
            const year: number = new Date().getFullYear();
            const calendar = await this.eventService.getEventCalendar(year);

            return this.apiResponse.ok({ calendar });
        }
        public async index(_request: Request) {
            const events = await this.eventService.getAllEvents();

            return this.apiResponse.created({ events });
        }
        public async insert(request: Request) {
            const event = await this.eventService.createNewEvent(request);

            return this.apiResponse.ok({ event });
        }
        public async update(request: Request) {
            const { id } = request.params;
            const event = await this.eventService.updateEventById(id, request);

            return this.apiResponse.updated(event);
        }
        public async destroy(request: Request) {
            const { id } = request.params;
            const deletedEvent = await this.eventService.deleteEventById(id);

            return this.apiResponse.deleted(deletedEvent);
        }
    }
