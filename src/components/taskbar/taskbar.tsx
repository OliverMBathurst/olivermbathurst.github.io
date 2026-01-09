import { useContext, useMemo } from "react"
import { WindowsContext } from "../../contexts"
import { SearchBar } from "../searchBar"
import {
	DateDisplay,
	MinimizeAllButton,
	StartButton,
	TaskbarItem
} from "./components"
import "./taskbar.scss"

interface ITaskbarProps {
	onStartButtonClicked: () => void
}

const Taskbar = (props: ITaskbarProps) => {
	const { onStartButtonClicked } = props
	const { windowProperties, onMinimizeAllButtonClicked } =
		useContext(WindowsContext)

	const TaskbarItems = useMemo(() => {
		return windowProperties.map((wp) => {
			return <TaskbarItem key={wp.id} windowProperties={wp} />
		})
	}, [windowProperties])

	return (
		<div className="taskbar">
			<StartButton onStartButtonClicked={onStartButtonClicked} />
			<SearchBar type="text" placeholder="Search..." />
			<div className="taskbar__items-container">{TaskbarItems}</div>
			<DateDisplay />
			<MinimizeAllButton onMinimizeAllClicked={onMinimizeAllButtonClicked} />
		</div>
	)
}

export default Taskbar
