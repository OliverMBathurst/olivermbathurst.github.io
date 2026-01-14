import { useMemo, useState } from "react"
import { NO_SELECT_CLASS } from "../../constants"
import { CollapseIcon, ExpandIcon } from "../../icons"
import './calendar.scss'

const months: Record<number, string> = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December"
}

const days: Record<number, string> = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
}

const initialDate = new Date()

const Calendar = () => {
    const [date, setDate] = useState<{ year: number, month: number }>({ year: initialDate.getFullYear(), month: initialDate.getMonth() })

    const frames = useMemo(() => {
        const { year, month } = date
        const firstDateOfTargetMonth = new Date(year, month, 1);
        const firstDayOfTargetMonth = firstDateOfTargetMonth.getDay()

        let firstSundayDayNumber: number
        if (firstDayOfTargetMonth === 0) {
            firstSundayDayNumber = 1
        } else {
            firstSundayDayNumber = 7 - firstDayOfTargetMonth + 1
        }

        const sundays = []
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        for (let j = firstSundayDayNumber; j < daysInMonth; j += 7) {
            sundays.push(j)
        }

        const weeksBefore = 1
        let weeksAfter = 1
        if (sundays.length === 5) {
            weeksAfter = 0
        }

        let daysInPreviousMonth: number
        if (month === 0) {
            daysInPreviousMonth = new Date(year - 1, 12, 0).getDate()
        } else {
            daysInPreviousMonth = new Date(year, month, 0).getDate()
        }

        let daysInNextMonth: number
        if (month === 12) {
            daysInNextMonth = new Date(year + 1, 0, 0).getDate()
        } else {
            daysInNextMonth = new Date(year, month + 1, 0).getDate()
        }

        const firstSundayOfTargetMonth = new Date(year, month, firstSundayDayNumber)

        const firstSunday = new Date(year, month, firstSundayDayNumber)
        firstSunday.setDate(firstSundayOfTargetMonth.getDate() - (7 * weeksBefore))

        const frame: { dayNumber: number, grey: boolean }[] = []

        for (let pS = firstSunday.getDate(); pS <= daysInPreviousMonth; pS++) {
            frame.push({ dayNumber: pS, grey: true })
        }

        for (let iS = firstDateOfTargetMonth.getDate(); iS <= firstSundayDayNumber; iS++) {
            frame.push({ dayNumber: iS, grey: false })
        }

        for (let d = firstSundayDayNumber + 1; d <= daysInMonth; d++) {
            frame.push({ dayNumber: d, grey: false })
        }

        const left = 42 - frame.length;
        for (let nD = 0; nD < left; nD++) {
            frame.push({ dayNumber: nD + 1, grey: true })
        }

        const frames: { dayNumber: number, grey: boolean }[][] = []
        frames.push([])
        let fi = 0
        for (let f = 0; f < frame.length; f++) {
            if (fi === 7) {
                frames.push([])
                fi = 0
            }
            frames[frames.length - 1].push(frame[f])

            fi++
        }

        return frames
    }, [date])

    const navigateBackwards = () => {
        const { year, month } = date

        let m = month
        let y = year
        if (m === 0) {
            m = 11
            y--
        } else {
            m--
        }

        setDate({ year: y, month: m })
    }

    const navigateForwards = () => {
        const { year, month } = date

        let m = month
        let y = year
        if (m === 11) {
            m = 0
            y++
        } else {
            m++
        }

        setDate({ year: y, month: m })
    }

    return (
        <div className="calendar">
            <div className="calendar__upper-container">
                <span className={`calendar__upper-container__date-display ${NO_SELECT_CLASS}`}>
                    {months[date.month]}, {date.year}
                </span>
                <div className="calendar__upper-container__controls">
                    <div className="calendar__upper-container__controls__control">
                        <ExpandIcon width={20} height={20} onClick={navigateForwards} />
                    </div>
                    <div className="calendar__upper-container__controls__control">
                        <CollapseIcon width={20} height={20} onClick={navigateBackwards} />
                    </div>
                </div>
            </div>
            <div className="calendar__lower-container">
                <table className="calendar__lower-container__table">
                    <tr className="calendar__lower-container__table__column-names">
                        <th>{days[0].substring(0, 2)}</th>
                        <th>{days[1].substring(0, 2)}</th>
                        <th>{days[2].substring(0, 2)}</th>
                        <th>{days[3].substring(0, 2)}</th>
                        <th>{days[4].substring(0, 2)}</th>
                        <th>{days[5].substring(0, 2)}</th>
                        <th>{days[6].substring(0, 2)}</th>
                    </tr>
                    {frames.map((frame, frameIdx) => {
                        return (
                            <tr key={frameIdx}>
                                {frame.map(cell => {
                                    const { dayNumber, grey } = cell
                                    return (
                                        <td key={`${frameIdx}-${dayNumber}`} className={`calendar__lower-container__table__cell${grey ? "--grey" : ""} ${NO_SELECT_CLASS}`}>
                                            {dayNumber}
                                        </td>
                                    )
                                })}
                            </tr>)
                    })}
                </table>
            </div>
        </div>)
}

export default Calendar