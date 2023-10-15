import EventRepository from "../repositories/event.repository";
import { NotFoundError } from "../enums/errors";
import { ResponseMessage } from "../enums/response";
import CalendarRepository from "../repositories/calendar.repository";
export default class EventService {
    constructor(eventModel, calendarModel) {
        this.eventRepository = new EventRepository(eventModel);
        this.calendarRepository = new CalendarRepository(calendarModel);
    }
    async getEventCalendar(year) {
        const calendar = await this.calendarRepository.findByYear(year);
        const events = await this.eventRepository.findAll();
        events.forEach((event) => {
            var _a;
            const { title, slug, date } = event;
            const [month, day] = date.split("-").slice(1);
            (_a = calendar.months[MONTHS[Number(month) - 1]][Number(day) - 1].event) === null || _a === void 0 ? void 0 : _a.push({
                title,
                slug,
            });
        });
        return calendar;
    }
    getAllEvents() {
        return this.eventRepository.findAll();
    }
    createNewEvent(request) {
        return this.eventRepository.insert(request);
    }
    async updateEventById(id, request) {
        const event = await this.eventRepository.isExist(id);
        if (!event) {
            throw new NotFoundError(ResponseMessage.EVENT_NOT_FOUND);
        }
        return this.eventRepository.updateById(id, request.body);
    }
    async deleteEventById(id) {
        const event = await this.eventRepository.isExist(id);
        if (!event) {
            throw new NotFoundError(ResponseMessage.EVENT_NOT_FOUND);
        }
        return this.eventRepository.deleteById(id);
    }
}
