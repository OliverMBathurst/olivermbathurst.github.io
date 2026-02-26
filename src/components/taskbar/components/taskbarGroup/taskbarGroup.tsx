import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import { CLASSNAMES } from "../../../../constants"
import {
    ContextMenuContext,
    RegistryContext,
    TaskbarGroupContext,
    WindowsContext
} from "../../../../contexts"
import { getIcon } from "../../../../helpers/icons"
import { getDisplayName } from "../../../../helpers/naming"
import { useFileSystem } from "../../../../hooks"
import { CloseIcon, MaximizeIcon, MinimizeIcon } from "../../../../icons"
import {
    IAddWindowProperties,
    IWindowProperties
} from "../../../../interfaces/windows"
import { Context } from "../../../../types/fs"
import { ContextMenu, IContextMenuItem } from "../../../contextMenu"
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
	const [contextMenuKey, setContextMenuKey] = useState<string | null>(null)

	const groupRef = useRef<HTMLDivElement | null>(null)
	const timeout = useRef<number | undefined>(undefined)
	const panelInFocus = useRef<boolean>(false)
	const contextMenuHasBeenInFocus = useRef<boolean>(false)

	const {
		addWindow,
		onTaskbarItemClicked,
		removeWindow,
		closeWindows,
		minimiseWindows,
		maximiseWindow,
		onWindowSelected
	} = useContext(WindowsContext)
	const { applicationPaths } = useContext(RegistryContext)
	const { openGroupHandlerId, setOpenGroupHandlerId } =
		useContext(TaskbarGroupContext)
	const { openContextMenuId, closeContextMenu, openContextMenu, closeAllContextMenus } = useContext(ContextMenuContext)
	const { validateFilePath } = useFileSystem()

	useEffect(() => {
		const appPath = applicationPaths[handlerId]
		setApplication(validateFilePath(appPath))
	}, [applicationPaths, handlerId, validateFilePath, setApplication])

	const Icon = application ? getIcon(application) : null

	const anySelected = items.filter((x) => x.selected).length > 0

	const showContextMenu = contextMenuKey && openContextMenuId === contextMenuKey

	const onContextMenuDismissed = (closeAll: boolean = false) => {
		if (closeAll) {
			closeAllContextMenus()
		} else if (contextMenuKey) {
			closeContextMenu(contextMenuKey)
		}
		setContextMenuKey(null)
		contextMenuHasBeenInFocus.current = false
	}

	const onAfterContextMenuItemClicked = () => {
		onContextMenuDismissed()
	}

	const onCloseAllClicked = () => {
		closeWindows(items.map(item => item.id))
		onAfterContextMenuItemClicked()
	}

	const onMinimiseAllClicked = () => {
		minimiseWindows(items.map(item => item.id))
		onAfterContextMenuItemClicked()
	}

	const onMaximiseClicked = (windowId: string) => {
		maximiseWindow(windowId)
		onWindowSelected(windowId, true)
		onAfterContextMenuItemClicked()
	}

	const onTaskbarItemClickedInternal = (windowId: string, contextMenuSelection: boolean = false) => {
		onTaskbarItemClicked(windowId)
		if (contextMenuSelection) {
			onAfterContextMenuItemClicked()
		}
	}

	const ContextMenuItems: IContextMenuItem[] = useMemo(() => {
		const contextMenuItems: IContextMenuItem[] = items.map(item => {
			return {
				value: getDisplayName(item.context),
				selected: item.selected,
				onClick: () => onTaskbarItemClickedInternal(item.id, true),
				icon: getIcon(item.context)
			}
		})

		contextMenuItems.push({
			value: `Close window${items.length > 1 ? "s" : ""}`,
			onClick: onCloseAllClicked,
			icon: <CloseIcon />
		})

		if (items.length === 1) {
			contextMenuItems.push({
				value: "Maximise window",
				onClick: () => onMaximiseClicked(items[0].id),
				icon: <MaximizeIcon />
			})
		}

		contextMenuItems.push({
			value: `Minimise window${items.length > 1 ? "s" : ""}`,
			onClick: onMinimiseAllClicked,
			icon: <MinimizeIcon />
		})

		return contextMenuItems
	}, [items, getDisplayName, onTaskbarItemClicked, getIcon, onCloseAllClicked, onMinimiseAllClicked])

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

		if (e.button !== 2 && e.buttons !== 2) {
			onContextMenuDismissed()
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
		if (showContextMenu && !contextMenuHasBeenInFocus.current) {
			return
		}

		panelInFocus.current = true
		setShowPane(true)
		setOpenGroupHandlerId(handlerId)
		onContextMenuDismissed(true)
	}

	const onContextMenuMouseOver = () => {
		contextMenuHasBeenInFocus.current = true
	}

	const onPanelMouseOver = (
		_: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		panelInFocus.current = true
	}

	const onCloseButtonClickedInternal = (windowId: string) =>
		removeWindow(windowId)

	const onContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault()

		const key = `${Date.now()}`
		setContextMenuKey(key)
		openContextMenu(key)
		setShowPane(false)
	}

	return (
		<>
			{showContextMenu && (
				<ContextMenu
					positionRef={groupRef}
					onClickOutside={onContextMenuDismissed}
					onMouseOver={onContextMenuMouseOver}
					items={ContextMenuItems}
				/>
			)}
			{showPane && !contextMenuKey && openGroupHandlerId === handlerId && (
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
				onContextMenu={onContextMenu}
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
