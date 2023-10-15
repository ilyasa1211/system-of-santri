/**
 * Add date by a spesific number
 */
export function addDay(date: Date, number: number): void {
    date.setDate(date.getDate() + number);
}

/**
 * Get month name
 */
export function getMonthName(date: Date, locale: string): string {
    return new Intl.DateTimeFormat(locale, { month: "long" }).format(date);
}

/**
 * Get day name
 */
export function getDayName(date: Date, locale: string): string {
    return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date);
}

/**
 * Get all dates, get the whole calendar
 */
export default function getCalendar(
    year: number | null = null,
    locale: string = "id",
): Record<string, any> {
    const date: Date = new Date();
    year && date.setFullYear(year);
    date.setMonth(0);
    date.setDate(1);

    const YEAR: number = date.getFullYear();
    const bulan: Record<string, any> = {};

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
