import { useEffect, useRef, useState } from "react"
import { CLASSNAMES } from "../../../../constants"
import "./dateDisplay.scss"

const {
	DATE_DISPLAY_BASE_CLASS,
	DATE_DISPLAY_OVERLAY_CLASS,
	DATE_DISPLAY_PICKER_ID,
	NO_SELECT_CLASS
} = CLASSNAMES

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
		<div className={DATE_DISPLAY_BASE_CLASS} onClick={onDateClicked}>
			<input
				ref={inputRef}
				id={DATE_DISPLAY_PICKER_ID}
				type="datetime-local"
				className={DATE_DISPLAY_PICKER_ID}
			/>
			<span className={`${DATE_DISPLAY_OVERLAY_CLASS} ${NO_SELECT_CLASS}`}>
				{date}
			</span>
		</div>
	)
}

export default DateDisplay
