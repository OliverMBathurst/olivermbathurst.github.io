import React, { JSX, useMemo } from "react"
import { CLASSNAMES } from "../../../../constants"
import { showCustomIconInWindowTopBar } from "../../../../helpers/icons"
import { useDisplayName, useIcon } from "../../../../hooks"
import { CloseIcon, MaximizeIcon, MinimizeIcon } from "../../../../icons"
import { Context } from "../../../../types/fs"
import "./windowTopBar.scss"

const { NO_SELECT_CLASS, WINDOW_CLASSES: { TOP_BAR } } = CLASSNAMES

interface IWindowTopBarProps {
	context: Context
	customContent: JSX.Element | null
	onMaximiseButtonClicked: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => void
	onMinimiseButtonClicked: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => void
	onCloseButtonClicked: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
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
		customContent,
		onWindowTopBarMouseDown,
		onMaximiseButtonClicked,
		onMinimiseButtonClicked,
		onCloseButtonClicked,
		onWindowTopBarDoubleClicked
	} = props

	const showCustomIcon = showCustomIconInWindowTopBar(context)
	const Icon = useIcon(context, true, undefined, undefined, showCustomIcon)
	const DisplayName = useDisplayName(context)

	const Content = useMemo(() => {
		if (!customContent) {
			return (
				<>
					<div
						className={`window__top-bar__icon ${NO_SELECT_CLASS}`}
						onMouseDown={(e) => e.stopPropagation()}
					>
						{Icon}
					</div>
					<span className={`window__top-bar__title ${NO_SELECT_CLASS}`}>
						{DisplayName}
					</span>
				</>
			)
		}

		return customContent
	}, [customContent, Icon, DisplayName])

	const onWindowTopBarMouseDownInternal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (e.button === 0 || e.buttons === 1) {
			onWindowTopBarMouseDown(e)
		}
	}

	const onWindowTopBarDoubleClickInternal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (e.target === e.currentTarget && e.currentTarget.className === TOP_BAR) {
			onWindowTopBarDoubleClicked(e)
		}
	}

	const onMinimiseButtonClickedInternal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation()
		onMinimiseButtonClicked(e)
	}

	const onMaximiseButtonClickedInternal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation()
		onMaximiseButtonClicked(e)
	}

	const onCloseButtonClickedInternal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation()
		onCloseButtonClicked(e)
	}

	return (
		<div
			className={TOP_BAR}
			onMouseDown={onWindowTopBarMouseDownInternal}
			onDoubleClick={onWindowTopBarDoubleClickInternal}
		>
			{Content}
			<div className="window__top-bar__controls">
				<div
					className="window__top-bar__controls__button"
					onClick={onMinimiseButtonClickedInternal}
				>
					<MinimizeIcon className={NO_SELECT_CLASS} {...imgProps} />
				</div>
				<div
					className="window__top-bar__controls__button"
					onClick={onMaximiseButtonClickedInternal}
				>
					<MaximizeIcon className={NO_SELECT_CLASS} {...imgProps} />
				</div>
				<div
					className="window__top-bar__controls__close-button"
					onClick={onCloseButtonClickedInternal}
				>
					<CloseIcon className={NO_SELECT_CLASS} {...imgProps} />
				</div>
			</div>
		</div>
	)
}

export default WindowTopBar
