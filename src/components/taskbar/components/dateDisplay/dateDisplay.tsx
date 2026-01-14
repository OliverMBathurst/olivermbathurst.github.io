import { useEffect, useRef, useState } from "react"
import "./dateDisplay.scss"
import { NO_SELECT_CLASS } from "../../../../constants"

const DATE_PICKER_ID = "date-display__input"

interface IDateDisplayProps {
	onDateClicked: () => void
}

const DateDisplay = (props: IDateDisplayProps) => {
	const { onDateClicked } = props
	const [date, setDate] = useState<string>()
	const inputRef = useRef<HTMLInputElement | null>(null)

	const setDateInternal = () => {
		const now = new Date()
		now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
		const formattedDate = now
			.toISOString()
			.slice(0, 19)
			.replaceAll("-", "/")
			.replaceAll("T", " ")
		setDate(formattedDate)
	}

	useEffect(() => {
		setDateInternal()

		const timeout = setInterval(() => {
			setDateInternal()
		}, 1000)
		return () => clearInterval(timeout)
	}, [])

	return (
		<div className="date-display">
			<input
				ref={inputRef}
				id={DATE_PICKER_ID}
				type="datetime-local"
				className={DATE_PICKER_ID}
			/>
			<span
				className={`date-display__overlay ${NO_SELECT_CLASS}`}
				onClick={onDateClicked}
			>
				{date}
			</span>
		</div>
	)
}

export default DateDisplay
