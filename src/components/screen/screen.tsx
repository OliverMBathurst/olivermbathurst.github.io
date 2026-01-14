import { useContext, useEffect, useState } from "react"
import { FileSystemContext, WindowsContext } from "../../contexts"
import { Calendar } from "../calendar"
import { Desktop } from "../desktop"
import { ScreenSaverTwo } from "../screenSaverTwo"
import { StartMenu } from "../startMenu"
import { Taskbar } from "../taskbar"
import { Window } from "../window"
import "./screen.scss"

const Screen = () => {
	const { windowProperties } = useContext(WindowsContext)
	const { runIndexer } = useContext(FileSystemContext)

	const [startMenuShow, setStartMenuShow] = useState<boolean>(false)
	const [calendarShow, setCalendarShow] = useState<boolean>(false)

	useEffect(() => {
		runIndexer()
	}, [])

	return (
		<div className="screen">
			<div className="screen__render-area">
				<ScreenSaverTwo />
				<Desktop />
				{windowProperties.map((p) => (
					<Window key={p.id} properties={p} />
				))}
				{startMenuShow && (
					<StartMenu onClickOutside={() => setStartMenuShow((s) => !s)} />
				)}
				{calendarShow && (
					<Calendar />
				)}
			</div>
			<Taskbar
				onStartButtonClicked={() => setStartMenuShow((s) => !s)}
				onDateClicked={() => setCalendarShow(s => !s)}
			/>
		</div>
	)
}

export default Screen
