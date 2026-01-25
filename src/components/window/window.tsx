import React, { memo, useCallback, useContext, useEffect, useRef } from "react"
import {
	BRANCHING_CONTEXT_DETERMINER,
	DEFAULT_MIN_WINDOW_HEIGHT_PIXELS,
	DEFAULT_MIN_WINDOW_WIDTH_PIXELS,
	DEFAULT_POINTER,
	DEFAULT_TASKBAR_HEIGHT_PIXELS,
	FILETYPE_RENDERABLE_PROPERTY,
	TASKBAR_ITEM_CLASS,
	TASKBAR_ITEM_NAME_CLASS
} from "../../constants"
import { WindowsContext } from "../../contexts"
import { WindowExpandDirection } from "../../enums"
import {
	getCursor,
	getExpandDirectionByRefAndPosition,
	heightChangesEnum,
	widthChangesEnum,
	xChangesEnum,
	yChangesEnum
} from "../../helpers/direction"
import { useClickOutside } from "../../hooks"
import { ISize, IWindowProperties, WindowState } from "../../interfaces/windows"
import { Visibility } from "../../types"
import { FileBrowser } from "../fileBrowser"
import { WindowTopBar } from "./components"
import "./window.scss"

const clickOutsideExclusions: string[] = [
	TASKBAR_ITEM_CLASS,
	TASKBAR_ITEM_NAME_CLASS
]

interface IWindowProps {
	properties: IWindowProperties
}

const Window = (props: IWindowProps) => {
	const {
		properties: { id, context, size, state, selected }
	} = props

	const previousWindowSize = useRef<ISize>(size)
	const currentWindowSize = useRef<ISize>(size)

	const windowRef = useRef<HTMLDivElement | null>(null)
	const windowPositionRef = useRef<{ x: number; y: number } | undefined>(
		undefined
	)

	const windowPreviousPositioning = useRef<{ top: string; left: string }>({
		top: "0",
		left: "0"
	})

	const windowIsMovingRef = useRef<boolean>(false)

	const windowExpanding = useRef<boolean>(false)
	const windowExpandDirection = useRef<WindowExpandDirection>(
		WindowExpandDirection.None
	)

	const {
		removeWindow,
		onWindowStateChanged,
		onWindowSelected,
		lastDeselectedWindowId,
		noWindowsSelected
	} = useContext(WindowsContext)
	const { width, height } = currentWindowSize.current

	useClickOutside(windowRef, (e) => {
		if (selected) {
			let validClick: boolean = true
			if (e.target instanceof HTMLElement) {
				const elem = e.target as HTMLElement
				if (clickOutsideExclusions.some((x) => elem.classList.contains(x))) {
					validClick = false
				}
			}

			if (validClick) {
				onWindowSelected(id, false)
			}
		}
	})

	const onMaximiseRequested = () => {
		if (state === WindowState.Maximised) {
			const div = windowRef.current
			if (div) {
				div.style.top = windowPreviousPositioning.current.top
				div.style.left = windowPreviousPositioning.current.left
			}
			currentWindowSize.current = previousWindowSize.current
			previousWindowSize.current = {
				width: window.innerWidth,
				height: window.innerHeight - DEFAULT_TASKBAR_HEIGHT_PIXELS
			}
			onWindowStateChanged(id, WindowState.Normal)
		} else {
			const div = windowRef.current
			if (div) {
				div.style.top = "50%"
				div.style.left = "50%"
			}
			previousWindowSize.current = currentWindowSize.current
			currentWindowSize.current = {
				width: window.innerWidth,
				height: window.innerHeight - DEFAULT_TASKBAR_HEIGHT_PIXELS
			}
			onWindowStateChanged(id, WindowState.Maximised)
		}
	}

	const onMaximiseButtonClicked = (
		_: React.MouseEvent<HTMLImageElement, MouseEvent>
	) => onMaximiseRequested()

	const onMinimiseButtonClicked = (
		_: React.MouseEvent<HTMLImageElement, MouseEvent>
	) => onWindowStateChanged(id, WindowState.Minimised)

	const onWindowTopBarDoubleClicked = (
		_: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => onMaximiseRequested()

	const onCloseButtonClicked = useCallback(
		(_: React.MouseEvent<HTMLImageElement, MouseEvent>) => removeWindow(id),
		[removeWindow, id]
	)

	const onWindowTopBarMouseDown = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (!selected) {
			onWindowSelected(id, true)
		}

		if (state === WindowState.Maximised) {
			return
		}

		windowPositionRef.current = {
			x: e.clientX,
			y: e.clientY
		}

		windowIsMovingRef.current = true

		window.onmousemove = onWindowTopBarMouseMove
	}

	const onWindowTopBarMouseUp = (_: MouseEvent) => {
		if (state === WindowState.Maximised) {
			return
		}

		windowIsMovingRef.current = false
		window.onmousemove = null

		if (windowRef.current) {
			windowPreviousPositioning.current = {
				top: windowRef.current.style.top,
				left: windowRef.current.style.left
			}
		}
	}

	const onWindowTopBarMouseMove = useCallback(
		(e: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			if (!windowIsMovingRef.current) {
				return
			}

			if (state === WindowState.Maximised) {
				return
			}

			if (windowPositionRef.current) {
				const pos1 = windowPositionRef.current.x - e.clientX
				const pos2 = windowPositionRef.current.y - e.clientY
				windowPositionRef.current.x = e.clientX
				windowPositionRef.current.y = e.clientY

				const elem = windowRef.current
				if (elem) {
					let top = elem.offsetTop - pos2
					let left = elem.offsetLeft - pos1

					if (top < 0) {
						top = 0
					} else if (
						top + elem.clientHeight >
						window.innerHeight - DEFAULT_TASKBAR_HEIGHT_PIXELS
					) {
						top =
							window.innerHeight -
							DEFAULT_TASKBAR_HEIGHT_PIXELS -
							elem.clientHeight
					}

					if (left < 0) {
						left = 0
					} else if (left + elem.clientWidth > window.innerWidth) {
						left = window.innerWidth - elem.clientWidth
					}

					elem.style.top = top + "px"
					elem.style.left = left + "px"
				}
			}
		},
		[id, state, onWindowStateChanged]
	)

	const onWindowMouseOvered = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (windowIsMovingRef.current || windowExpanding.current) {
			return
		}

		const expandDirection = getExpandDirectionByRefAndPosition(windowRef, e)
		if (window && windowRef.current) {
			windowRef.current.style.cursor = getCursor(
				expandDirection,
				DEFAULT_POINTER
			)
		}
	}

	const onWindowMouseDown = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (!windowRef.current) {
			return
		}

		const expandDirection = getExpandDirectionByRefAndPosition(windowRef, e)
		if (expandDirection === WindowExpandDirection.None) {
			return
		}

		windowExpanding.current = true
		windowExpandDirection.current = expandDirection
	}

	const onWindowMouseUp = (_: MouseEvent) => {
		if (windowExpanding.current) {
			windowExpanding.current = false
			windowExpandDirection.current = WindowExpandDirection.None
		}
	}

	const onWindowContentClicked = (
		_: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (!selected) {
			onWindowSelected(id, true)
		}
	}

	const onWindowMouseMove = useCallback(
		(e: MouseEvent) => {
			if (windowExpanding.current && windowRef.current) {
				const getCorrectedWidth = (
					xPos: number,
					width: number,
					widthDiff: number
				): number => {
					const proposed = width + widthDiff
					if (xPos + proposed > window.innerWidth) {
						return window.innerWidth - xPos
					}
					return proposed
				}

				const getCorrectedHeight = (
					yPos: number,
					height: number,
					heightDiff: number
				): number => {
					const proposed = height + heightDiff
					if (
						yPos + proposed >
						window.innerHeight - DEFAULT_TASKBAR_HEIGHT_PIXELS
					) {
						return window.innerHeight - DEFAULT_TASKBAR_HEIGHT_PIXELS - yPos
					}
					return proposed
				}

				const getCorrectedX = (x: number): number => {
					if (!windowRef.current) {
						return x
					}

					if (x > window.innerWidth - windowRef.current.clientWidth) {
						return window.innerWidth - windowRef.current.clientWidth
					}

					return x < 0 ? 1 : x
				}

				const getCorrectedY = (y: number): number => {
					if (!windowRef.current) {
						return y
					}

					if (
						y >
						window.innerHeight -
							DEFAULT_TASKBAR_HEIGHT_PIXELS -
							windowRef.current.clientHeight
					) {
						return (
							window.innerHeight -
							DEFAULT_TASKBAR_HEIGHT_PIXELS -
							windowRef.current.clientHeight
						)
					}

					return y < 0 ? 1 : y
				}

				const rect = windowRef.current.getBoundingClientRect()

				const originalWidth: number = windowRef.current.clientWidth
				const originalHeight: number = windowRef.current.clientHeight
				let newX: number = rect.left
				let newY: number = rect.top
				let newWidth: number = windowRef.current.clientWidth
				let newHeight: number = windowRef.current.clientHeight

				if (
					(windowExpandDirection.current & xChangesEnum) ===
					windowExpandDirection.current
				) {
					newX = getCorrectedX(e.clientX)
					newWidth = getCorrectedWidth(
						newX,
						windowRef.current.clientWidth,
						rect.left - newX
					)
				}

				if (
					(windowExpandDirection.current & yChangesEnum) ===
					windowExpandDirection.current
				) {
					newY = getCorrectedY(e.clientY)
					newHeight = getCorrectedHeight(
						rect.top,
						windowRef.current.clientHeight,
						rect.top - newY
					)
				}

				if (
					(windowExpandDirection.current & heightChangesEnum) ===
					windowExpandDirection.current
				) {
					newHeight = getCorrectedHeight(
						rect.top,
						windowRef.current.clientHeight,
						e.clientY - rect.bottom
					)
				}

				if (
					(windowExpandDirection.current & widthChangesEnum) ===
					windowExpandDirection.current
				) {
					newWidth = getCorrectedWidth(
						rect.left,
						windowRef.current.clientWidth,
						e.clientX - rect.right
					)
				}

				if (newWidth !== originalWidth || newHeight !== originalHeight) {
					if (
						newWidth >= DEFAULT_MIN_WINDOW_WIDTH_PIXELS &&
						newHeight >= DEFAULT_MIN_WINDOW_HEIGHT_PIXELS
					) {
						previousWindowSize.current = {
							width: originalWidth,
							height: originalHeight
						}
						currentWindowSize.current = {
							width: newWidth,
							height: newHeight
						}

						windowRef.current.style.width = `${newWidth}px`
						windowRef.current.style.height = `${newHeight}px`

						if (rect.left !== newX || rect.top !== newY) {
							windowRef.current.style.top = `${newY}px`
							windowRef.current.style.left = `${newX}px`

							windowPositionRef.current = {
								x: newX,
								y: newY
							}
						}
					}

					if (state === WindowState.Maximised) {
						onWindowStateChanged(id, WindowState.Normal)
					}
				}
			}
		},
		[id, state, onWindowStateChanged]
	)

	useEffect(() => {
		if (windowRef.current) {
			let x = window.innerWidth / 2
			let y = (window.innerHeight - DEFAULT_TASKBAR_HEIGHT_PIXELS) / 2

			x -= windowRef.current.clientWidth / 2
			y -= windowRef.current.clientHeight / 2

			const top = `${y}px`
			const left = `${x}px`

			windowRef.current.style.top = top
			windowRef.current.style.left = left

			windowPreviousPositioning.current = {
				top: top,
				left: left
			}
		}
	}, [])

	useEffect(() => {
		document.addEventListener("mousemove", onWindowMouseMove)
		document.addEventListener("mousemove", onWindowTopBarMouseMove)

		document.addEventListener("mouseup", onWindowMouseUp)
		document.addEventListener("mouseup", onWindowTopBarMouseUp)

		return () => {
			document.removeEventListener("mousemove", onWindowMouseMove)
			document.removeEventListener("mousemove", onWindowTopBarMouseMove)

			document.removeEventListener("mouseup", onWindowMouseUp)
			document.removeEventListener("mouseup", onWindowTopBarMouseUp)
		}
	}, [onWindowMouseMove, onWindowTopBarMouseMove])

	const Content = useCallback(() => {
		if (FILETYPE_RENDERABLE_PROPERTY in context) {
			return context.render()
		}

		if (BRANCHING_CONTEXT_DETERMINER in context) {
			return <FileBrowser windowId={id} context={context} />
		}

		return null
	}, [id, context])

	const visibility: Visibility =
		state === WindowState.Minimised ? "hidden" : "visible"

	const translation =
		state === WindowState.Maximised ? "translate(-50%, -50%)" : "none"

	return (
		<div
			className={`window${selected || (noWindowsSelected && lastDeselectedWindowId === id) ? " window--selected" : ""}`}
			style={{
				height: height,
				width: width,
				visibility: visibility,
				transform: translation
			}}
			ref={windowRef}
			onMouseOver={onWindowMouseOvered}
			onMouseDown={onWindowMouseDown}
		>
			<div className="window__inner-content">
				<WindowTopBar
					context={context}
					onWindowTopBarMouseDown={onWindowTopBarMouseDown}
					onMaximiseButtonClicked={onMaximiseButtonClicked}
					onMinimiseButtonClicked={onMinimiseButtonClicked}
					onCloseButtonClicked={onCloseButtonClicked}
					onWindowTopBarDoubleClicked={onWindowTopBarDoubleClicked}
				/>
				<div
					className="window__inner-content__content"
					onClick={onWindowContentClicked}
				>
					<Content />
				</div>
			</div>
		</div>
	)
}

export default memo(Window)
