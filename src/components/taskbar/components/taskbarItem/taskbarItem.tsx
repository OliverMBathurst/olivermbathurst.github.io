import { useContext } from "react"
import {
	NO_SELECT_CLASS,
	TASKBAR_ITEM_CLASS,
	TASKBAR_ITEM_NAME_CLASS
} from "../../../../constants"
import { WindowsContext } from "../../../../contexts"
import { useDisplayName, useIcon } from "../../../../hooks"
import { IWindowProperties } from "../../../../interfaces/windows"
import "./taskbarItem.scss"

interface ITaskbarItemProps {
	windowProperties: IWindowProperties
}

const TaskbarItem = (props: ITaskbarItemProps) => {
	const { windowProperties } = props
	const { context, id: windowId, selected } = windowProperties

	const Icon = useIcon(context)
	const DisplayName = useDisplayName(context)

	const { onTaskbarItemClicked } = useContext(WindowsContext)

	return (
		<div
			className={`${TASKBAR_ITEM_CLASS}${selected ? " taskbar-item--selected" : ""} ${NO_SELECT_CLASS}`}
			onClick={() => onTaskbarItemClicked(windowId)}
		>
			{Icon}
			<span className={TASKBAR_ITEM_NAME_CLASS}>{DisplayName}</span>
		</div>
	)
}

export default TaskbarItem
