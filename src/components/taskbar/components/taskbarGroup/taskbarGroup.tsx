import { useContext, useEffect, useRef, useState } from "react"
import { CLASSNAMES } from "../../../../constants"
import {
	RegistryContext,
	TaskbarGroupContext,
	WindowsContext
} from "../../../../contexts"
import { getIcon } from "../../../../helpers/icons"
import { useFileSystem } from "../../../../hooks"
import {
	IAddWindowProperties,
	IWindowProperties
} from "../../../../interfaces/windows"
import { Context } from "../../../../types/fs"
import { TaskbarGroupPane } from "./components"
import "./taskbarGroup.scss"

const {
	NO_SELECT_CLASS,
	TASKBAR_GROUP_CLASSES: {
		TASKBAR_GROUP_CONTAINER_CLASS,
		TASKBAR_GROUP_CONTAINER_MULTIPLE_CLASS,
		TASKBAR_GROUP_CONTAINER_SELECTED_CLASS,
		TASKBAR_GROUP_CONTAINER_TASKBAR_GROUP_CLASS,
		TASKBAR_GROUP_CONTAINER_TASKBAR_GROUP_ICON_CLASS,
		TASKBAR_GROUP_CONTAINER_TASKBAR_GROUP_ICON_SELECTED_CLASS
	}
} = CLASSNAMES

interface ITaskbarGroupProps {
	handlerId: string
	items: IWindowProperties[]
}

const TaskbarGroup = (props: ITaskbarGroupProps) => {
	const { items, handlerId } = props
	const [showPane, setShowPane] = useState<boolean>(false)
	const [application, setApplication] = useState<Context | null>(null)

	const groupRef = useRef<HTMLDivElement | null>(null)
	const timeout = useRef<number | undefined>(undefined)
	const panelInFocus = useRef<boolean>(false)

	const { addWindow, onTaskbarItemClicked, removeWindow } =
		useContext(WindowsContext)
	const { applicationPaths } = useContext(RegistryContext)
	const { openGroupHandlerId, setOpenGroupHandlerId } =
		useContext(TaskbarGroupContext)
	const { validateFilePath } = useFileSystem()

	useEffect(() => {
		const appPath = applicationPaths[handlerId]
		setApplication(validateFilePath(appPath))
	}, [applicationPaths, handlerId, validateFilePath, setApplication])

	const Icon = application ? getIcon(application) : null

	const anySelected = items.filter((x) => x.selected).length > 0

	const onGroupPaneItemClicked = (
		_: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (items.length === 1) {
			onTaskbarItemClicked(items[0].id)
			return
		}

		setShowPane(true)
	}

	const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation()
		if (e.button === 1 && application) {
			const windowProperties: IAddWindowProperties = {
				context: application,
				handlerId
			}

			addWindow(windowProperties)
		}
	}

	const onMouseOut = (_: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		panelInFocus.current = false

		clearTimeout(timeout.current)

		timeout.current = setTimeout(() => {
			if (!panelInFocus.current) {
				setShowPane(false)
			}
		}, 400)
	}

	const onContainerMouseOver = (
		_: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		panelInFocus.current = true
		setShowPane(true)
		setOpenGroupHandlerId(handlerId)
	}

	const onPanelMouseOver = (
		_: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		panelInFocus.current = true
	}

	const onTaskbarItemClickedInternal = (windowId: string) =>
		onTaskbarItemClicked(windowId)

	const onCloseButtonClickedInternal = (windowId: string) =>
		removeWindow(windowId)

	return (
		<>
			{showPane && openGroupHandlerId === handlerId && (
				<TaskbarGroupPane
					groupRef={groupRef}
					items={items}
					onItemClicked={onTaskbarItemClickedInternal}
					onCloseButtonClicked={onCloseButtonClickedInternal}
					onMouseOver={onPanelMouseOver}
					onMouseOut={onMouseOut}
				/>
			)}
			<div
				className={`${anySelected ? TASKBAR_GROUP_CONTAINER_SELECTED_CLASS : TASKBAR_GROUP_CONTAINER_CLASS}${items.length > 1 ? ` ${TASKBAR_GROUP_CONTAINER_MULTIPLE_CLASS}` : ""}`}
				ref={groupRef}
				onClick={onGroupPaneItemClicked}
				onMouseDown={onMouseDown}
				onMouseOver={onContainerMouseOver}
				onMouseOut={onMouseOut}
			>
				<div
					className={`${TASKBAR_GROUP_CONTAINER_TASKBAR_GROUP_CLASS} ${NO_SELECT_CLASS}`}
				>
					<div
						className={`${anySelected ? TASKBAR_GROUP_CONTAINER_TASKBAR_GROUP_ICON_SELECTED_CLASS : TASKBAR_GROUP_CONTAINER_TASKBAR_GROUP_ICON_CLASS}`}
					>
						{Icon}
					</div>
				</div>
			</div>
		</>
	)
}

export default TaskbarGroup
