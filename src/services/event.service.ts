// import { Request } from "express";
// import Event from "../models/event.model";
// import EventRepository from "../repositories/event.repository";
// import { NotFoundError } from "../errors/errors";
// import { ResponseMessage } from "../enums/response";
// import CalendarRepository from "../repositories/calendar.repository";

// export default class EventService {
//     private eventRepository;
//     private calendarRepository;

//     public constructor(
//         eventModel: typeof Event,
//         calendarModel: typeof Calendar,
//     ) {
//         this.eventRepository = new EventRepository(eventModel);
//         this.calendarRepository = new CalendarRepository(calendarModel);
//     }

//     public async getEventCalendar(year: number) {
//         const calendar = await this.calendarRepository.findByYear(year);
//         const events = await this.eventRepository.findAll();
//         events.forEach((event) => {
//             const { title, slug, date } = event;
//             const [month, day] = date.split("-").slice(1);
//             calendar.months[MONTHS[Number(month) - 1]][
//                 Number(day) - 1
//             ].event?.push({
//                 title,
//                 slug,
//             });
//         });
//         return calendar;
//     }
//     public getAllEvents() {
//         return this.eventRepository.findAll();
//     }
//     public createNewEvent(request: Request) {
//         return this.eventRepository.insert(request);
//     }
//     public async updateEventById(id: string, request: Request) {
//         const event = await this.eventRepository.isExist(id);
//         if (!event) {
//             throw new NotFoundError(ResponseMessage.EVENT_NOT_FOUND);
//         }
//         return this.eventRepository.updateById(id, request.body);
//     }
//     public async deleteEventById(id: string) {
//         const event = await this.eventRepository.isExist(id);
//         if (!event) {
//             throw new NotFoundError(ResponseMessage.EVENT_NOT_FOUND);
//         }
//         return this.eventRepository.deleteById(id);
//     }
// }
