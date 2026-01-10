import { useCallback, useEffect, useRef } from "react"
import { IPosition } from "../interfaces/windows"

const styles: React.CSSProperties = {
	backgroundColor: "aqua",
	opacity: 0.3,
	position: "absolute",
	border: "blue 0.1875rem solid",
	visibility: "hidden"
}

export const useWindowSelectionRectangle = <T extends HTMLElement>(
	ref: React.RefObject<T | null>,
	onRectangleChanged: (rect: DOMRect) => void,
	exclusiveClassName?: string
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
		if (selectionRectangeRef.current && ref.current) {
			selectionRectangeRef.current.style.position = `absolute`
			selectionRectangeRef.current.style.width = `0px`
			selectionRectangeRef.current.style.height = `0px`

			selectionRectangeRef.current.style.visibility = "visible"
			selecting.current = true

			const elem = ref.current.getBoundingClientRect()

			// TODO: Fix offsets
			selectionRectangeStart.current = {
				x: e.clientX - elem.left,
				y: e.clientY - elem.top
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

			const xOffset = e.offsetX
			const yOffset = e.offsetY

			const newWidth = Math.abs(selectionRectangeStart.current.x - xOffset)
			const newHeight = Math.abs(selectionRectangeStart.current.y - yOffset)

			if (selectionRectangeStart.current.x > xOffset) {
				selectionRectangeRef.current.style.left = `${xOffset}px`
			}

			if (selectionRectangeStart.current.y > yOffset) {
				selectionRectangeRef.current.style.top = `${yOffset}px`
			}

			selectionRectangeRef.current.style.width = `${newWidth}px`
			selectionRectangeRef.current.style.height = `${newHeight}px`

			onRectangleChanged(selectionRectangeRef.current.getBoundingClientRect())
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
