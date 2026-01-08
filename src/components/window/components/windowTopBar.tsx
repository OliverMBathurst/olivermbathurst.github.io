import React from "react"
import { useDisplayName, useIcon } from "../../../hooks"
import { CloseIcon, MaximizeIcon, MinimizeIcon } from "../../../icons"
import { Context } from "../../../types/fs"
import "./windowTopBar.scss"
import { NO_SELECT_CLASS } from "../../../constants"

interface IWindowTopBarProps {
	context: Context
	onMaximiseButtonClicked: (
		e: React.MouseEvent<HTMLImageElement, MouseEvent>
	) => void
	onMinimiseButtonClicked: (
		e: React.MouseEvent<HTMLImageElement, MouseEvent>
	) => void
	onCloseButtonClicked: (
		e: React.MouseEvent<HTMLImageElement, MouseEvent>
	) => void
	onWindowTopBarMouseDown: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => void
	onWindowTopBarDoubleClicked: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => void
}

const imgProps = {
	onMouseDown: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) =>
		e.stopPropagation(),
	onMouseUp: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) =>
		e.stopPropagation(),
	onMouseMove: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) =>
		e.stopPropagation()
}

const WindowTopBar = (props: IWindowTopBarProps) => {
	const {
		context,
		onWindowTopBarMouseDown,
		onMaximiseButtonClicked,
		onMinimiseButtonClicked,
		onCloseButtonClicked,
		onWindowTopBarDoubleClicked
	} = props

	const Icon = useIcon(context)
	const DisplayName = useDisplayName(context)

	return (
		<div
			className="window__top-bar"
			onMouseDown={onWindowTopBarMouseDown}
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
				<div className="window__top-bar__controls__button">
					<MinimizeIcon
						className={NO_SELECT_CLASS}
						onClick={onMinimiseButtonClicked}
						{...imgProps}
					/>
				</div>
				<div className="window__top-bar__controls__button">
					<MaximizeIcon
						className={NO_SELECT_CLASS}
						onClick={onMaximiseButtonClicked}
						{...imgProps}
					/>
				</div>
				<div className="window__top-bar__controls__close-button">
					<CloseIcon
						className={NO_SELECT_CLASS}
						onClick={onCloseButtonClicked}
						{...imgProps}
					/>
				</div>
			</div>
		</div>
	)
}

export default WindowTopBar
