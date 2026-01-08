import React, { useContext, useEffect } from "react"
import { DesktopItemContext } from "../../../../contexts"
import { useDisplayName, useIcon } from "../../../../hooks"
import { Context } from "../../../../types/fs"
import "./desktopItem.scss"

interface IDesktopItemProps {
	context: Context
	onDoubleClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
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

	useEffect(() => {
		window.addEventListener("resize", onWindowResized)

		return () => {
			window.removeEventListener("resize", () => onWindowResized)
		}
	}, [onWindowResized])

	const onDesktopItemDoubleClickedInternal = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
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
			className={`desktop-item${selected ? " desktop-item--selected" : ""}`}
			ref={(r) => addElementReference(r, context)}
			onClick={(e) => onDesktopItemClickedInternal(e, context)}
			onDoubleClick={(e) => onDesktopItemDoubleClickedInternal(e)}
			onDragStart={onDragStart}
			draggable
		>
			<div className="desktop-item__icon no-select">{Icon}</div>
			<span className="desktop-item__name no-select">{DisplayName}</span>
		</div>
	)
}

export default DesktopItem
