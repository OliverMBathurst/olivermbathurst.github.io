import React, { useCallback, useContext } from "react"
import { NO_SELECT_CLASS } from "../../../constants"
import { useDisplayName, useIcon } from "../../../hooks"
import { CloseIcon, MaximizeIcon, MinimizeIcon } from "../../../icons"
import { Context } from "../../../types/fs"
import "./windowTopBar.scss"
import { WindowsContext } from "../../../contexts"

interface IWindowTopBarProps {
	id: string
	context: Context
	refCallback: (r: HTMLDivElement) => void
	onMaximiseButtonClicked: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => void
	onMinimiseButtonClicked: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => void
	onWindowTopBarMouseDown: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => void
	onWindowTopBarMouseMove: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => void
	onWindowTopBarDoubleClicked: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => void
	onWindowTopBarMouseOvered: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => void
}

const imgProps: React.ImgHTMLAttributes<HTMLImageElement> = {
	onMouseDown: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) =>
		e.stopPropagation(),
	onMouseUp: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) =>
		e.stopPropagation(),
	onMouseMove: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) =>
		e.stopPropagation()
}

const WindowTopBar = (props: IWindowTopBarProps) => {
	const {
		id,
		context,
		refCallback,
		onWindowTopBarMouseDown,
		onWindowTopBarMouseMove,
		onMaximiseButtonClicked,
		onMinimiseButtonClicked,
		onWindowTopBarDoubleClicked,
		onWindowTopBarMouseOvered
	} = props

	const { removeWindow } = useContext(WindowsContext)

	const Icon = useIcon(context)
	const DisplayName = useDisplayName(context)

	const onCloseButtonClicked = useCallback(
		(_: React.MouseEvent<HTMLImageElement, MouseEvent>) => removeWindow(id),
		[removeWindow, id]
	)

	return (
		<div
			className="window__top-bar"
			ref={refCallback}
			onMouseDown={onWindowTopBarMouseDown}
			onMouseOver={onWindowTopBarMouseOvered}
			onMouseMove={onWindowTopBarMouseMove}
			onDoubleClick={onWindowTopBarDoubleClicked}
		>
			<div
				className={`window__top-bar__icon ${NO_SELECT_CLASS}`}
				onMouseDown={(e) => e.stopPropagation()}
			>
				{Icon}
			</div>
			<span className={`window__top-bar__title ${NO_SELECT_CLASS}`}>
				{DisplayName}
			</span>
			<div className="window__top-bar__controls">
				<div
					className="window__top-bar__controls__button"
					onClick={onMinimiseButtonClicked}
				>
					<MinimizeIcon
						className={NO_SELECT_CLASS}
						{...imgProps}
					/>
				</div>
				<div
					className="window__top-bar__controls__button"
					onClick={onMaximiseButtonClicked}
				>
					<MaximizeIcon
						className={NO_SELECT_CLASS}
						{...imgProps}
					/>
				</div>
				<div
					className="window__top-bar__controls__close-button"
					onClick={onCloseButtonClicked}
				>
					<CloseIcon
						className={NO_SELECT_CLASS}
						{...imgProps}
					/>
				</div>
			</div>
		</div>
	)
}

export default WindowTopBar
