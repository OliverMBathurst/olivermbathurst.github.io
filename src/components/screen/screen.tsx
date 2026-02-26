import { useContext, useEffect, useRef, useState } from "react"
import {
    FileSystemContext,
    RegistryContext,
    WindowsContext
} from "../../contexts"
import { useWallpaper } from "../../hooks"
import { WindowPropertiesService } from "../../services"
import { Context } from "../../types/fs"
import { Calendar } from "../calendar"
import { Desktop } from "../desktop"
import { StartMenu } from "../startMenu"
import { Taskbar } from "../taskbar"
import { Window } from "../window"
import "./screen.scss"

const windowPropertiesService = new WindowPropertiesService()

const Screen = () => {
	const { windowProperties, addWindow } = useContext(WindowsContext)
	const { runIndexer } = useContext(FileSystemContext)
	const registry = useContext(RegistryContext)
	const Wallpaper = useWallpaper()

	const [startMenuShow, setStartMenuShow] = useState<boolean>(false)
	const [calendarShow, setCalendarShow] = useState<boolean>(false)

	const taskbarSearchBarElement = useRef<HTMLInputElement | null>(null)

	const onWindowResized = () => {
		setStartMenuShow(false)
		setCalendarShow(false)
	}

	const onStartMenuSearchBarFocused = () => {
		setStartMenuShow(false)
		const taskbarSearchBarElem = taskbarSearchBarElement.current
		if (taskbarSearchBarElem) {
			taskbarSearchBarElem.focus()
		}
	}

	const onItemDoubleClicked = (context: Context) => {
		const properties = windowPropertiesService.getProperties(context, registry)
		if (properties) {
			addWindow(properties)
		}

		setStartMenuShow((s) => !s)
	}

	useEffect(() => {
		window.addEventListener("resize", onWindowResized)

		return () => {
			window.removeEventListener("resize", onWindowResized)
		}
	}, [onWindowResized])

	useEffect(() => {
		runIndexer()
	}, [])

	return (
		<div className="screen">
			<div className="screen__render-area">
				{Wallpaper}
				<Desktop />
				{windowProperties.map((p) => (
					<Window key={p.id} properties={p} />
				))}
				{startMenuShow && (
					<StartMenu
						onClickOutside={() => setStartMenuShow((s) => !s)}
						onSearchBarFocused={onStartMenuSearchBarFocused}
						onItemDoubleClicked={onItemDoubleClicked}
					/>
				)}
				{calendarShow && (
					<Calendar onClickOutside={() => setCalendarShow((s) => !s)} />
				)}
			</div>
			<Taskbar
				onStartButtonClicked={() => setStartMenuShow((s) => !s)}
				onDateClicked={() => setCalendarShow((s) => !s)}
				taskbarSearchBarCallback={(elem) =>
					(taskbarSearchBarElement.current = elem)
				}
			/>
		</div>
	)
}

export default Screen
