import { useEffect, useState } from "react"
import "./dateDisplay.scss"

const DateDisplay = () => {
	const [date, setDate] = useState<string>()

	useEffect(() => {
		var timeout = setInterval(() => {
			var newDate: Date = new Date()
			newDate.setSeconds(newDate.getSeconds() + newDate.getTimezoneOffset())
			setDate(newDate.toLocaleTimeString())
		}, 1000)
		return () => clearInterval(timeout)
	}, [])

	return (
		<div className="date-display">
			<span>{date}</span>
		</div>
	)
}

export default DateDisplay
