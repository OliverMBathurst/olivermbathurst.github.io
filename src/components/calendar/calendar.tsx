import { useMemo, useRef, useState } from "react"
import {
    CALENDAR_YEAR_RANGE_YEARS,
    DATE_DISPLAY_BASE_CLASS,
    DATE_DISPLAY_OVERLAY_CLASS,
    NO_SELECT_CLASS
} from "../../constants"
import { chunk } from "../../helpers/collections"
import { days, monthNumbersByString, monthStringsByNumber } from "../../helpers/date"
import { useClickOutside } from "../../hooks"
import { CollapseIcon, ExpandIcon } from "../../icons"
import "./calendar.scss"

const initialDate = new Date()
const frameSize = 42
const clickOutsideExclusions = [
	DATE_DISPLAY_BASE_CLASS,
	DATE_DISPLAY_OVERLAY_CLASS
]

const currentYear = initialDate.getFullYear()
const yearsStart = currentYear - CALENDAR_YEAR_RANGE_YEARS
const yearsEnd = currentYear + CALENDAR_YEAR_RANGE_YEARS

const years: number[] = []
for (let i = yearsStart; i <= yearsEnd; i++) {
	years.push(i)
}

interface ICalendarProps {
	onClickOutside: () => void
}

const Calendar = (props: ICalendarProps) => {
	const { onClickOutside } = props

	const [date, setDate] = useState<{ year: number; month: number }>({
		year: initialDate.getFullYear(),
		month: initialDate.getMonth()
	})

	const calendarRef = useRef<HTMLDivElement | null>(null)
	const monthRef = useRef<HTMLSelectElement | null>(null)
	const yearRef = useRef<HTMLSelectElement | null>(null)

	useClickOutside(calendarRef, (e) => {
		let validClick: boolean = true
		if (e.target instanceof HTMLElement) {
			const elem = e.target as HTMLElement
			if (clickOutsideExclusions.some((x) => elem.classList.contains(x))) {
				validClick = false
			}
		}

		if (validClick) {
			onClickOutside()
		}
	})

	const frames = useMemo(() => {
		const { year, month } = date
		const firstDateOfTargetMonth = new Date(year, month, 1)
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
		firstSunday.setDate(firstSundayOfTargetMonth.getDate() - 7)

		const frame: { dayNumber: number; grey: boolean }[] = []

		for (let pS = firstSunday.getDate(); pS <= daysInPreviousMonth; pS++) {
			frame.push({ dayNumber: pS, grey: true })
		}

		for (let d = firstDateOfTargetMonth.getDate(); d <= daysInMonth; d++) {
			frame.push({ dayNumber: d, grey: false })
		}

		const left = frameSize - frame.length
		for (let nD = 0; nD < left; nD++) {
			frame.push({ dayNumber: nD + 1, grey: true })
		}

		return chunk(frame, 7)
	}, [date, chunk])

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

		setSelectValues(m, y)
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

		setSelectValues(m, y)
		setDate({ year: y, month: m })
	}

	const setYearBySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value
		setDate(d => {
			return {
				...d,
				year: parseInt(value)
			}
		})
	}

	const setMonthBySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value
		setDate(d => {
			return {
				...d,
				month: monthNumbersByString[value]
			}
		})
	}

	const setSelectValues = (month: number, year: number) => {
		if (monthRef.current && yearRef.current) {
			monthRef.current.value = monthStringsByNumber[month]
			yearRef.current.value = `${year}`
		}
	}

	return (
		<div className="calendar" ref={calendarRef}>
			<div className="calendar__upper-container">
				<span
					className={`calendar__upper-container__date-display ${NO_SELECT_CLASS}`}
				>
					<select
						ref={monthRef}
						defaultValue={monthStringsByNumber[date.month]}
						onChange={setMonthBySelect}
					>
						{Object.keys(monthStringsByNumber).map(m => {
							return (
								<option key={m} className="calendar__upper-container__date-display__select-option">
									{monthStringsByNumber[parseInt(m)]}
								</option>
							)
						})}
					</select>
					<select
						ref={yearRef}
						defaultValue={date.year}
						onChange={setYearBySelect}
					>
						{years.map(y => {
							return (
								<option key={y} className="calendar__upper-container__date-display__select-option">
									{y}
								</option>
							)
						})}
					</select>
				</span>
				<div className="calendar__upper-container__controls">
					<div className="calendar__upper-container__controls__control">
						<ExpandIcon onClick={navigateForwards} />
					</div>
					<div className="calendar__upper-container__controls__control">
						<CollapseIcon onClick={navigateBackwards} />
					</div>
				</div>
			</div>
			<div className="calendar__lower-container">
				<table className="calendar__lower-container__table">
					<tbody>
						<tr className="calendar__lower-container__table__column-names">
							{days.map((d) => {
								return <th key={d}>{d.substring(0, 2)}</th>
							})}
						</tr>
						{frames.map((frame, frameIdx) => {
							return (
								<tr key={frameIdx}>
									{frame.map((cell) => {
										const { dayNumber, grey } = cell
										return (
											<td
												key={`${frameIdx}-${dayNumber}`}
												className={`calendar__lower-container__table__cell${grey ? "--grey" : ""} ${NO_SELECT_CLASS}`}
											>
												{dayNumber}
											</td>
										)
									})}
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default Calendar
