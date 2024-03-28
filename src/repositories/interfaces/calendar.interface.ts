export default interface CalendarInterface {
    findAll(): Promise<unknown>;
    findById(id: string): Promise<unknown>;
    findByYear(year: number): Promise<unknown>;
}
