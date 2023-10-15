export default class CalendarRepository {
    constructor(calendarModel) {
        this.calendarModel = calendarModel;
    }
    findAll() {
        return this.calendarModel.find().exec();
    }
    findById(id) {
        return this.calendarModel.findById(id).exec();
    }
    findByYear(year) {
        return this.calendarModel.findOne({ year }).exec();
    }
}
