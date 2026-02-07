import React from "react"
import { CLASSNAMES } from "../../../../../../constants"
import { useDisplayName, useIcon } from "../../../../../../hooks"
import { CloseIcon } from "../../../../../../icons"
import { IWindowProperties } from "../../../../../../interfaces/windows"
import "./taskbarItem.scss"

const {
	NO_SELECT_CLASS,
	TASKBAR_ITEM_CLASSES: {
		TASKBAR_ITEM_CLASS,
		TASKBAR_ITEM_ICON_CLASS,
		TASKBAR_ITEM_INNER_CLASS,
		TASKBAR_ITEM_NAME_CLASS,
		TASKBAR_ITEM_SELECTED_CLASS
	}
} = CLASSNAMES

interface ITaskbarItemProps {
	windowProperties: IWindowProperties
	onItemClicked: (windowId: string) => void
	onCloseButtonClicked: (windowId: string) => void
}

const TaskbarItem = (props: ITaskbarItemProps) => {
	const { windowProperties, onItemClicked, onCloseButtonClicked } = props

	const { context, id: windowId, selected } = windowProperties

	const Icon = useIcon(context)

	const DisplayName = useDisplayName(context)

	const onCloseButtonClickedInternal = (
		e: React.MouseEvent<HTMLImageElement, MouseEvent>
	) => {
		e.stopPropagation()
		onCloseButtonClicked(windowId)
	}

	return (
		<div
			className={`${selected ? TASKBAR_ITEM_SELECTED_CLASS : TASKBAR_ITEM_CLASS}`}
			onClick={() => onItemClicked(windowId)}
		>
			<CloseIcon
				className={`${TASKBAR_ITEM_ICON_CLASS} ${NO_SELECT_CLASS}`}
				onClick={onCloseButtonClickedInternal}
			/>
			<div className={`${TASKBAR_ITEM_INNER_CLASS} ${NO_SELECT_CLASS}`}>
				{Icon}
				<span className={TASKBAR_ITEM_NAME_CLASS}>{DisplayName}</span>
			</div>
		</div>
	)
}

export default TaskbarItem
