import React, { useContext, useEffect } from "react"
import {
    DESKTOP_ITEM_CLASS,
    DESKTOP_ITEM_ICON_CLASS,
    DESKTOP_ITEM_NAME_CLASS,
    NO_SELECT_CLASS
} from "../../../../constants"
import { DesktopItemContext } from "../../../../contexts"
import { useDisplayName, useIcon } from "../../../../hooks"
import { Context } from "../../../../types/fs"
import "./desktopItem.scss"

interface IDesktopItemProps {
	context: Context
	onDoubleClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent> | KeyboardEvent) => void
}

const DesktopItem = (props: IDesktopItemProps) => {
	const { context, onDoubleClick } = props

	const {
		selectedContextKeys,
		addElementReference,
		onDesktopItemClicked,
		onDesktopItemDoubleClicked,
		onWindowResized
	} = useContext(DesktopItemContext)

	const Icon = useIcon(context)
	const DisplayName = useDisplayName(context)
	const selected =
		selectedContextKeys.indexOf(context.toContextUniqueKey()) !== -1
	const contextKey = context.toContextUniqueKey()

	const onDesktopItemKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Enter" && selected) {
			setTimeout(() => {
				onDesktopItemDoubleClicked(e)
				onDoubleClick(e)
			}, 100)
		}
	}

	useEffect(() => {
		document.addEventListener("keypress", onDesktopItemKeyDown)

		return () => {
			document.removeEventListener("keypress", onDesktopItemKeyDown)
		}
	}, [onDesktopItemKeyDown])

	useEffect(() => {
		window.addEventListener("resize", onWindowResized)

		return () => {
			window.removeEventListener("resize", onWindowResized)
		}
	}, [onWindowResized])

	const onDesktopItemDoubleClickedInternal = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent> | KeyboardEvent
	) => {
		e.stopPropagation()
		onDesktopItemDoubleClicked(e)
		onDoubleClick(e)
	}

	const onDesktopItemClickedInternal = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		context: Context
	) => {
		e.stopPropagation()
		onDesktopItemClicked(e, context)
	}

	const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
		e.dataTransfer.setData("text", contextKey)
	}

	return (
		<div
			id={contextKey}
			className={`${DESKTOP_ITEM_CLASS}${selected ? " desktop-item--selected" : ""}`}
			ref={(r) => addElementReference(r, context)}
			onClick={(e) => onDesktopItemClickedInternal(e, context)}
			onDoubleClick={(e) => onDesktopItemDoubleClickedInternal(e)}
			
			onDragStart={onDragStart}
			draggable
		>
			<div className={`${DESKTOP_ITEM_ICON_CLASS} ${NO_SELECT_CLASS}`}>
				{Icon}
			</div>
			<span className={`${DESKTOP_ITEM_NAME_CLASS} ${NO_SELECT_CLASS}`}>
				{DisplayName}
			</span>
		</div>
	)
}

export default DesktopItem
