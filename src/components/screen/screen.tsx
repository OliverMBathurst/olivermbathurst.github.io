import { useContext, useEffect, useState } from "react"
import { FileSystemContext, WindowsContext } from "../../contexts"
import { Calendar } from "../calendar"
import { Desktop } from "../desktop"
import { Colours } from "../screenSaver"
import { StartMenu } from "../startMenu"
import { Taskbar } from "../taskbar"
import { Window } from "../window"
import "./screen.scss"

const Screen = () => {
	const { windowProperties } = useContext(WindowsContext)
	const { runIndexer } = useContext(FileSystemContext)

	const [startMenuShow, setStartMenuShow] = useState<boolean>(false)
	const [calendarShow, setCalendarShow] = useState<boolean>(false)

	const onWindowResized = () => {
		setStartMenuShow(false)
		setCalendarShow(false)
	}

	useEffect(() => {
		runIndexer()
	}, [])

	useEffect(() => {
		window.addEventListener("resize", onWindowResized)

		return () => {
			window.removeEventListener("resize", onWindowResized)
		}
	}, [onWindowResized])

	return (
		<div className="screen">
			<div className="screen__render-area">
				<Colours />
				<Desktop />
				{windowProperties.map((p) => (
					<Window key={p.id} properties={p} />
				))}
				{startMenuShow && (
					<StartMenu onClickOutside={() => setStartMenuShow((s) => !s)} />
				)}
				{calendarShow && (
					<Calendar onClickOutside={() => setCalendarShow((s) => !s)} />
				)}
			</div>
			<Taskbar
				onStartButtonClicked={() => setStartMenuShow((s) => !s)}
				onDateClicked={() => setCalendarShow((s) => !s)}
			/>
		</div>
	)
}

export default Screen
