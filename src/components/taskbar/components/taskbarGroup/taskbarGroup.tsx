import { useContext, useRef, useState } from "react"
import { NO_SELECT_CLASS } from "../../../../constants"
import { WindowsContext } from "../../../../contexts"
import { useIcon } from "../../../../hooks"
import { IWindowProperties } from "../../../../interfaces/windows"
import { TaskbarGroupPane } from "./components"
import "./taskbarGroup.scss"

interface ITaskbarGroupProps {
    handlerId: string
    items: IWindowProperties[]
}

const TaskbarGroup = (props: ITaskbarGroupProps) => {
	const { items } = props
	const [showPane, setShowPane] = useState<boolean>(false)
	const groupRef = useRef<HTMLDivElement | null>(null)

	const Icon = useIcon(items[0].context)
	const { onTaskbarItemClicked } = useContext(WindowsContext)
	const anySelected = items.some(x => x.selected)

	const onGroupPaneItemClicked = (_: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (items.length === 1) {
			onTaskbarItemClicked(items[0].id)
			return
		}
	}

	const onMouseOver = () => {
		// Show pane
	}

	const onMouseOut = () => {
		// Dismiss
	}

	return (
		<>
			{showPane && (
				<TaskbarGroupPane
					items={items}
					onGroupPaneItemClicked={onGroupPaneItemClicked}
				/>
			)}
			<div className="taskbar-group__container">
				<div
					className={`taskbar-group__container__taskbar-group${anySelected ? "--selected" : ""} ${NO_SELECT_CLASS}`}
					ref={groupRef}
					onClick={onGroupPaneItemClicked}
					onMouseOver={onMouseOver}
					onMouseOut={onMouseOut}
				>
					<div className="taskbar-group__container__taskbar-group__icon">
						{Icon}
					</div>
				</div>
			</div>
		</>
	)
}

export default TaskbarGroup