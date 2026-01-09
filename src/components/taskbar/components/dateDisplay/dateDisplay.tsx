import { useEffect, useState } from "react"
import "./dateDisplay.scss"

const DateDisplay = () => {
	const [date, setDate] = useState<string>()

	const setDateInternal = () => {
		const now = new Date()
		now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
		setDate(now.toISOString().slice(0, 19))
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
				type="datetime-local"
				className="date-display__input"
				value={date}
				onCopy={() => false}
				onCut={() => false}
			>
			</input>
		</div>)
}

export default DateDisplay
