import { Duration } from "../../../contracts/endpoint-stats/_common"

const hour = 3600 * 1000;
const day = 24 * hour;
const week = 7 * day;
const month = 30 * day;
const year = 365 * day;

export type Period = { name: string, startDate: Date, endDate: Date }

export function getTimePeriods(duration: Duration): Period[] {
    let realDuration: number
    const referenceDate = new Date()
    let periods: Period[] = []
    let keys: string[];
    switch (duration) {
        case "1h":
            realDuration = hour
            referenceDate.setHours(referenceDate.getHours() - 1)
            keys = Array.from({ length: 12 }).map((_, i) => `${60 - i * (60 / 12)} min ago`)
            periods = getPeriods(12, realDuration, referenceDate, keys)
            break;

        case "3h":
            realDuration = 3 * hour
            referenceDate.setHours(referenceDate.getHours() - 3)
            keys = Array.from({ length: 12 }).map((_, i) => `${(180 - i * 15) / 60} hour ago`)
            periods = getPeriods(12, realDuration, referenceDate, keys)
            break;

        case "6h":
            realDuration = 6 * hour
            referenceDate.setHours(referenceDate.getHours() - 6)
            keys = Array.from({ length: 12 }).map((_, i) => (12 - i) * 30 % 60 === 0 ? `${(12 - i) * 30 / 60} hour${(12 - i) * 30 / 60 > 0 ? "s" : ""} ago` : `${(12 - i) / 2} hour ago`)
            periods = getPeriods(12, realDuration, referenceDate, keys)
            break;

        case "12h":
            realDuration = 12 * hour
            referenceDate.setHours(referenceDate.getHours() - 12)
            keys = Array.from({ length: 12 }).map((_, i) => `${12 - i} hour ago`)
            periods = getPeriods(12, realDuration, referenceDate, keys)
            break;

        case "24h":
            realDuration = day
            referenceDate.setHours(referenceDate.getHours() - 24)
            keys = Array.from({ length: 12 }).map((_, i) => (12 - i) * 2 === 24 ? "1 day ago" : `${(12 - i) * 2} hour ago`)
            periods = getPeriods(12, realDuration, referenceDate, keys)
            break;

        case "7d":
            realDuration = week
            referenceDate.setDate(referenceDate.getDate() - 7)
            keys = Array.from({ length: 7 }).map((_, i) => `${7 - i} days ago`)
            periods = getPeriods(7, realDuration, referenceDate, keys)
            break;

        case "30d":
            realDuration = month
            referenceDate.setDate(referenceDate.getDate() - 30)
            keys = Array.from({ length: 30 }).map((_, i) => `${30 - i * 3} days ago`)
            periods = getPeriods(10, realDuration, referenceDate, keys)
            break;

        // case "90d":
        //     realDuration = 3 * month
        //     referenceDate.setMonth(referenceDate.getMonth() - 3)
        //     keys = Array.from({ length: 12 }).map((_, i) => {
        //         if ((12 - i * 4) % 4 === 0) return `${(12 - i * 4) / 4} month${(12 - i * 4) / 4 > 1 ? "s" : ""} ago`
        //         return `${(12 - i * 4)} week${(12 - i * 4) > 1 ? "s" : ""} ago`
        //     })
        //     console.log({ keys })
        //     periods = getPeriods(8, realDuration, referenceDate, keys)
        //     break;

        case "90d":
            realDuration = 3 * month
            referenceDate.setMonth(referenceDate.getMonth() - 3)
            keys = Array.from({ length: 12 }).map((_, i) => {
                if (3 - Math.floor((i + 1) / 4) === 0) return "current week"
                if ((i + 1) % 4 === 0) return `${3 - Math.floor((i + 1) / 4)} month${3 - Math.floor((i + 1) / 4) > 1 ? "s" : ""} ago`
                return `${11 - i} week${11 - i > 1 ? "s" : ""} ago`
            })
            periods = getPeriods(12, realDuration, referenceDate, keys)
            break;
        // case "6m":
        //     realDuration = 6 * month
        //     referenceDate.setMonth(referenceDate.getMonth() - 6)
        //     keys = Array.from({ length: 6 }).map((_, i) => `${6 - i} months ago`)
        //     periods = getPeriods(12, realDuration, referenceDate, keys)
        //     break;

        case "1y":
            realDuration = year
            referenceDate.setFullYear(referenceDate.getFullYear() - 1)
            keys = Array.from({ length: 12 }).map((_, i) => `${12 - i} months ago`)
            periods = getPeriods(12, realDuration, referenceDate, keys)
            break;

        // default:
        //     realDuration = year
        //     referenceDate.setFullYear(referenceDate.getFullYear() - 1)
        //     keys = Array.from({ length: 12 }).map((_, i) => `${12 - i} months ago`)
        //     periods = getPeriods(12, realDuration, referenceDate, keys)
        //     break;
    }
    return periods
}

function getPeriods(cuts: number, duration: number, start: Date, keys: string[]) {
    const periods: Period[] = []
    const periodDuration = duration / cuts
    let startDate = start

    for (let i = 0; i < cuts; i++) {
        const endDate = new Date(startDate.getTime() + periodDuration)
        periods.push({ name: keys[i], startDate, endDate })
        startDate = endDate
    }
    return periods
}