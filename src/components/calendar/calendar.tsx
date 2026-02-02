import { useMemo, useRef, useState } from "react"
import {
	CALENDAR_MONTH_COLUMN_SIZE,
	CALENDAR_MONTH_ROW_SIZE,
	CALENDAR_YEAR_COLUMN_SIZE,
	CALENDAR_YEAR_RANGE_YEARS,
	CALENDAR_YEAR_ROW_SIZE,
	DATE_DISPLAY_BASE_CLASS,
	DATE_DISPLAY_OVERLAY_CLASS,
	NO_SELECT_CLASS
} from "../../constants"
import { chunk } from "../../helpers/collections"
import { days, monthStringsByNumber } from "../../helpers/date"
import { useClickOutside } from "../../hooks"
import { CollapseIcon, ExpandIcon } from "../../icons"
import { Button } from "../button"
import "./calendar.scss"

const initialDate = new Date()
const initialYear = initialDate.getFullYear()
const initialMonth = initialDate.getMonth()
const initialDay = initialDate.getDate()

const frameSize = 42
const clickOutsideExclusions = [
	DATE_DISPLAY_BASE_CLASS,
	DATE_DISPLAY_OVERLAY_CLASS
]

const yearsStart = initialYear - CALENDAR_YEAR_RANGE_YEARS
const yearsEnd = initialYear + CALENDAR_YEAR_RANGE_YEARS

enum View {
	Days,
	Months,
	Years
}

interface ICalendarProps {
	onClickOutside: () => void
}

const Calendar = (props: ICalendarProps) => {
	const { onClickOutside } = props
	const [date, setDate] = useState<{
		year: number
		month: number
		day: number
	}>({
		year: initialYear,
		month: initialMonth,
		day: initialDay
	})
	const [view, setView] = useState<View>(View.Days)

	const calendarRef = useRef<HTMLDivElement | null>(null)

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

		const frame: { year: number; month: number; day: number; grey: boolean }[] =
			[]

		for (let pS = firstSunday.getDate(); pS <= daysInPreviousMonth; pS++) {
			frame.push({
				year: month === 0 ? year - 1 : year,
				month: month === 0 ? 11 : month - 1,
				day: pS,
				grey: true
			})
		}

		for (let d = firstDateOfTargetMonth.getDate(); d <= daysInMonth; d++) {
			frame.push({
				year,
				month,
				day: d,
				grey: false
			})
		}

		const left = frameSize - frame.length
		for (let nD = 0; nD < left; nD++) {
			frame.push({
				year: month === 11 ? year + 1 : year,
				month: month === 11 ? 0 : month + 1,
				day: nD + 1,
				grey: true
			})
		}

		return chunk(frame, 7)
	}, [date, chunk])

	const navigateBackwards = () => {
		if (view === View.Months) {
			setDate((vd) => {
				return {
					...vd,
					year: vd.year - 1
				}
			})
		} else if (view === View.Years) {
			setDate((d) => {
				return {
					...d,
					year:
						d.year + CALENDAR_YEAR_ROW_SIZE * CALENDAR_YEAR_COLUMN_SIZE >
						yearsEnd
							? yearsEnd
							: d.year + CALENDAR_YEAR_ROW_SIZE * CALENDAR_YEAR_COLUMN_SIZE
				}
			})
		} else {
			const { year, month } = date

			let m = month
			let y = year
			if (m === 0) {
				m = 11
				y--
			} else {
				m--
			}

			setDate((vd) => {
				return {
					...vd,
					month: m,
					year: y
				}
			})
		}
	}

	const navigateForwards = () => {
		if (view === View.Months) {
			setDate((vd) => {
				return {
					...vd,
					year: vd.year + 1
				}
			})
		} else if (view === View.Years) {
			setDate((d) => {
				return {
					...d,
					year:
						d.year - CALENDAR_YEAR_ROW_SIZE * CALENDAR_YEAR_COLUMN_SIZE <
						yearsStart
							? yearsStart
							: d.year - CALENDAR_YEAR_ROW_SIZE * CALENDAR_YEAR_COLUMN_SIZE
				}
			})
		} else {
			const { year, month } = date

			let m = month
			let y = year
			if (m === 11) {
				m = 0
				y++
			} else {
				m++
			}

			setDate((vd) => {
				return {
					...vd,
					month: m,
					year: y
				}
			})
		}
	}

	const onMonthSelected = (month: number, year: number) => {
		setDate((d) => {
			return {
				...d,
				month,
				year
			}
		})
		setView(View.Days)
	}

	const onDaySelected = (day: number, month: number, year: number) => {
		setDate(() => {
			return {
				day,
				month,
				year
			}
		})
	}

	const onYearSelected = (year: number) => {
		setDate((d) => {
			return {
				...d,
				year
			}
		})
		setView(View.Days)
	}

	const onYearsClicked = () => {
		setView((v) => (v === View.Years ? View.Days : View.Years))
	}

	const onMonthsClicked = () => {
		setView((v) => (v === View.Months ? View.Days : View.Months))
	}

	const Display = useMemo(() => {
		const { month: selectedMonth, year: selectedYear } = date
		if (view === View.Months) {
			const monthRows: { monthIdx: number; yearIdx: number }[][] = []
			monthRows.push([])

			let yearIdx: number = selectedYear
			let monthIdx: number = selectedMonth
			while (true) {
				monthRows[monthRows.length - 1].push({ monthIdx, yearIdx })
				if (
					monthRows[monthRows.length - 1].length === CALENDAR_MONTH_ROW_SIZE
				) {
					if (monthRows.length === CALENDAR_MONTH_COLUMN_SIZE) {
						break
					}
					monthRows.push([])
				}

				if (monthIdx === 11) {
					yearIdx++
					monthIdx = 0
				} else {
					monthIdx++
				}
			}

			return (
				<>
					{monthRows.map((monthRow, rowIdx) => {
						return (
							<tr key={rowIdx}>
								{monthRow.map((month) => {
									const { monthIdx, yearIdx } = month
									const selected =
										monthIdx === initialMonth && yearIdx === initialYear
									return (
										<td
											key={`${monthIdx}-${yearIdx}`}
											className={`calendar__lower-container__table__cell${yearIdx !== selectedYear ? "--grey" : ""}
												${selected ? " calendar__lower-container__table__cell--selected" : ""}
												${NO_SELECT_CLASS}`}
											onClick={() => onMonthSelected(monthIdx, yearIdx)}
										>
											{monthStringsByNumber[monthIdx].substring(0, 3)}
										</td>
									)
								})}
							</tr>
						)
					})}
				</>
			)
		}

		if (view === View.Years) {
			const yearRows: number[][] = []
			yearRows.push([])

			for (
				let i = selectedYear;
				i < selectedYear + CALENDAR_YEAR_ROW_SIZE * CALENDAR_YEAR_COLUMN_SIZE;
				i++
			) {
				yearRows[yearRows.length - 1].push(i)

				if (yearRows[yearRows.length - 1].length === CALENDAR_YEAR_ROW_SIZE) {
					yearRows.push([])
				}
			}

			let decadeEndYear = selectedYear
			while (decadeEndYear % 10 !== 0) {
				decadeEndYear++
			}

			return (
				<>
					{yearRows.map((yearRow, yearRowIdx) => {
						return (
							<tr key={yearRowIdx}>
								{yearRow.map((year) => {
									const selected = year === initialYear
									return (
										<td
											key={year}
											className={`calendar__lower-container__table__cell${year >= decadeEndYear ? "--grey" : ""}
												${selected ? " calendar__lower-container__table__cell--selected" : ""}
												${NO_SELECT_CLASS}`}
											onClick={() => onYearSelected(year)}
										>
											{year}
										</td>
									)
								})}
							</tr>
						)
					})}
				</>
			)
		}

		return (
			<>
				<tr className="calendar__lower-container__table__column-names">
					{days.map((d) => {
						return <th key={d}>{d.substring(0, 2)}</th>
					})}
				</tr>
				{frames.map((frame, frameIdx) => {
					return (
						<tr key={frameIdx}>
							{frame.map((cell) => {
								const { day, month, year, grey } = cell
								const selected =
									initialDay === day &&
									initialMonth === month &&
									initialYear === year
								return (
									<td
										key={`${frameIdx}-${day}`}
										className={`calendar__lower-container__table__cell${grey ? "--grey" : ""}
											${selected ? " calendar__lower-container__table__cell--selected" : ""}
											${NO_SELECT_CLASS}`}
										onClick={() => onDaySelected(day, month, year)}
									>
										{day}
									</td>
								)
							})}
						</tr>
					)
				})}
			</>
		)
	}, [view, initialDate, date, days, frames, onMonthSelected, onDaySelected])

	return (
		<div className="calendar" ref={calendarRef}>
			<div className="calendar__upper-container">
				<span
					className={`calendar__upper-container__date-display ${NO_SELECT_CLASS}`}
				>
					<Button onClick={onMonthsClicked}>
						{monthStringsByNumber[date.month]}
					</Button>
					<Button onClick={onYearsClicked}>{date.year}</Button>
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
					<tbody>{Display}</tbody>
				</table>
			</div>
		</div>
	)
}

export default Calendar
