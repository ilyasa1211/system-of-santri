/**
 * Add date by a spesific number
 */
export function addDay(date, number) {
    date.setDate(date.getDate() + number);
}
/**
 * Get month name
 */
export function getMonthName(date, locale) {
    return new Intl.DateTimeFormat(locale, { month: "long" }).format(date);
}
/**
 * Get day name
 */
export function getDayName(date, locale) {
    return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date);
}
/**
 * Get all dates, get the whole calendar
 */
export default function getCalendar(year = null, locale = "id") {
    const date = new Date();
    year && date.setFullYear(year);
    date.setMonth(0);
    date.setDate(1);
    const YEAR = date.getFullYear();
    const bulan = {};
    while (YEAR === date.getFullYear()) {
        const month = date.getMonth();
        const nameOfMonth = getMonthName(date, locale);
        bulan[nameOfMonth] = [];
        while (month === date.getMonth()) {
            const day = {
                date: date.getDate(),
                day: getDayName(date, locale),
                status: null,
                event: [],
            };
            bulan[nameOfMonth].push(day);
            addDay(date, 1);
        }
    }
    return bulan;
}
