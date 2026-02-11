import { useContext, useMemo, useRef, useState } from "react"
import {
    WindowsContext
} from "../../contexts"
import { IWindowProperties } from "../../interfaces/windows"
import { SearchBar } from "../searchBar"
import { DateDisplay, MinimizeAllButton, Search, StartButton } from "./components"
import { TaskbarGroup } from "./components/taskbarGroup"
import "./taskbar.scss"

interface ITaskbarProps {
	onStartButtonClicked: () => void
	onDateClicked: () => void
	taskbarSearchBarCallback: (elem: HTMLInputElement) => void
}

const Taskbar = (props: ITaskbarProps) => {
	const { onStartButtonClicked, onDateClicked, taskbarSearchBarCallback } =
		props
	const { windowProperties, onMinimizeAllButtonClicked } = useContext(WindowsContext)
	const searchBarRef = useRef<HTMLDivElement | null>(null)

	const [showSearch, setShowSearch] = useState<boolean>(false)
	const [searchBarText, setSearchBarText] = useState<string>("")

	const onSearchBarFocused = () => {
		setShowSearch(true)
	}

	const onSearchInputChanged = (text: string) => {
		setSearchBarText(text)
	}

	const onSearchCancelClicked = () => {
		setSearchBarText("")
	}

	const onSearchClickedOutside = () => {
		setSearchBarText("")
		setShowSearch(false)
	}

	const TaskbarGroups = useMemo(() => {
		const groupedByHandler: Record<string, IWindowProperties[]> = {}
		for (const wp of windowProperties) {
			if (groupedByHandler[wp.handlerId]) {
				groupedByHandler[wp.handlerId] = [...groupedByHandler[wp.handlerId], wp]
			} else {
				groupedByHandler[wp.handlerId] = [wp]
			}
		}

		return Object.keys(groupedByHandler).map((k) => {
			return <TaskbarGroup key={k} handlerId={k} items={groupedByHandler[k]} />
		})
	}, [windowProperties])

	return (
		<>
			{showSearch && (
				<Search
					text={searchBarText}
					positionRef={searchBarRef}
					onClickedOutside={onSearchClickedOutside}
				/>
			)}
			<div className="taskbar">
				<StartButton onStartButtonClicked={onStartButtonClicked} />
				<SearchBar
					type="text"
					value={searchBarText}
					placeholder="Search..."
					forwardRef={searchBarRef}
					onFocus={onSearchBarFocused}
					elementCallback={taskbarSearchBarCallback}
					onInputChange={onSearchInputChanged}
					onCancelClicked={onSearchCancelClicked}
				/>
				<div className="taskbar__groups-container">{TaskbarGroups}</div>
				<DateDisplay onDateClicked={onDateClicked} />
				<MinimizeAllButton onMinimizeAllClicked={onMinimizeAllButtonClicked} />
			</div>
		</>
	)
}

export default Taskbar
