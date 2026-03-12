import { useCallback, useEffect, useRef } from "react"
import { IPosition } from "../interfaces/windows"
import { isMouseDownLeftClick } from "../helpers/click"

const styles: React.CSSProperties = {
	backgroundColor: "aqua",
	opacity: 0.3,
	position: "absolute",
	visibility: "hidden"
}

export const useWindowSelectionRectangle = <T extends HTMLElement>(
	ref: React.RefObject<T | null>,
	onRectangleChanged: (rect: DOMRect) => void,
	applicableClassNames: string[]
) => {
	const selectionRectangeRef = useRef<HTMLDivElement | null>(null)
	const selecting = useRef<boolean>(false)
	const selectionRectangeStart = useRef<IPosition | undefined>(undefined)

	const onMouseUp = useCallback((_: MouseEvent) => {
		if (selectionRectangeRef.current) {
			selecting.current = false
			selectionRectangeRef.current.style.visibility = "hidden"
		}
	}, [])

	const onMouseDown = (e: MouseEvent) => {
		if (!isMouseDownLeftClick(e)) {
			return
		}

		if (
			!(e.target instanceof HTMLElement) ||
			applicableClassNames.indexOf(e.target.className) === -1
		) {
			return
		}

		if (selectionRectangeRef.current && ref.current) {
			selectionRectangeRef.current.style.position = `absolute`
			selectionRectangeRef.current.style.width = `0px`
			selectionRectangeRef.current.style.height = `0px`

			selectionRectangeRef.current.style.visibility = "visible"
			selecting.current = true

			const elem = ref.current.getBoundingClientRect()

			const parent = selectionRectangeRef.current.parentElement
			let parentOffsetTop = 0
			let parentOffsetLeft = 0
			if (parent) {
				parentOffsetTop = parent.offsetTop
				parentOffsetLeft = parent.offsetLeft
			}

			selectionRectangeStart.current = {
				x: e.clientX - elem.left + parentOffsetLeft,
				y: e.clientY - elem.top + parentOffsetTop
			}

			selectionRectangeRef.current.style.left = `${selectionRectangeStart.current.x}px`
			selectionRectangeRef.current.style.top = `${selectionRectangeStart.current.y}px`
		}
	}

	const onMouseMove = (e: MouseEvent) => {
		if (
			selectionRectangeRef.current &&
			selecting.current &&
			selectionRectangeStart.current
		) {
			if (!ref.current) {
				return
			}

			const elem = ref.current.getBoundingClientRect()

			const parent = selectionRectangeRef.current.parentElement
			let parentOffsetTop = 0
			let parentOffsetLeft = 0
			if (parent) {
				parentOffsetTop = parent.offsetTop
				parentOffsetLeft = parent.offsetLeft
			}

			let xOffset = e.clientX - elem.left + parentOffsetLeft
			let yOffset = e.clientY - elem.top + parentOffsetTop

			let newWidth = Math.abs(selectionRectangeStart.current.x - xOffset)
			let newHeight = Math.abs(selectionRectangeStart.current.y - yOffset)

			if (selectionRectangeStart.current.x > xOffset) {
				if (xOffset <= parentOffsetLeft) {
					xOffset = parentOffsetLeft
				}

				selectionRectangeRef.current.style.left = `${xOffset}px`
			}

			if (selectionRectangeStart.current.y > yOffset) {
				if (yOffset < parentOffsetTop) {
					yOffset = parentOffsetTop
				}

				selectionRectangeRef.current.style.top = `${yOffset}px`
			}

			if (
				xOffset >= selectionRectangeStart.current.x &&
				elem.left + selectionRectangeStart.current.x + newWidth >=
					elem.right + parentOffsetLeft
			) {
				newWidth =
					elem.right -
					elem.left -
					selectionRectangeStart.current.x -
					parentOffsetLeft
			}

			if (e.clientY >= elem.bottom) {
				newHeight = elem.bottom - e.clientY
			}

			if (xOffset !== parentOffsetLeft) {
				selectionRectangeRef.current.style.width = `${newWidth}px`
			}

			if (yOffset !== parentOffsetTop) {
				selectionRectangeRef.current.style.height = `${newHeight}px`
			}

			if (xOffset !== parentOffsetLeft || yOffset !== parentOffsetTop) {
				onRectangleChanged(selectionRectangeRef.current.getBoundingClientRect())
			}
		}
	}

	useEffect(() => {
		document.addEventListener("mouseup", onMouseUp)

		return () => {
			document.removeEventListener("mouseup", onMouseUp)
		}
	}, [onMouseUp])

	useEffect(() => {
		if (ref.current) {
			ref.current.addEventListener("mousedown", onMouseDown)
		}

		return () => {
			if (ref.current) {
				ref.current.removeEventListener("mousedown", onMouseDown)
			}
		}
	}, [onMouseDown])

	useEffect(() => {
		if (ref.current) {
			ref.current.addEventListener("mousemove", onMouseMove)
		}

		return () => {
			if (ref.current) {
				ref.current.removeEventListener("mousemove", onMouseMove)
			}
		}
	}, [onMouseDown])

	return <div style={{ ...styles }} ref={selectionRectangeRef} />
}

export default useWindowSelectionRectangle
