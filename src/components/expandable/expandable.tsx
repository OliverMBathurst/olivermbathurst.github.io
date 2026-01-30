import { useEffect, useRef } from "react"
import { DEFAULT_POINTER } from "../../constants"
import { ExpandDirection } from "../../enums"
import {
	getCursor,
	getExpandDirectionByRefAndPosition,
	heightChangesEnum,
	widthChangesEnum,
	xChangesEnum,
	yChangesEnum
} from "../../helpers/direction"

export interface IExpandableProps {
	children: React.ReactNode
	allowedExpandDirections: ExpandDirection
	minWidth?: number | undefined
	minHeight?: number | undefined
	maxWidth?: number | undefined
	maxHeight?: number | undefined
	onWidthChanged?: (newWidth: number) => void
	onHeightChanged?: (newHeight: number) => void
}

const Expandable = (props: IExpandableProps) => {
	const {
		children,
		allowedExpandDirections,
		minWidth,
		minHeight,
		maxWidth,
		maxHeight,
		onWidthChanged,
		onHeightChanged
	} = props

	const expanding = useRef<boolean>(false)
	const ref = useRef<HTMLDivElement | null>(null)

	const expandDirectionRef = useRef<ExpandDirection>(ExpandDirection.None)

	const onElementMouseOvered = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (expanding.current) {
			return
		}

		const expandDirection = getExpandDirectionByRefAndPosition(ref, e)
		if ((expandDirection & allowedExpandDirections) === expandDirection) {
			if (window && ref.current) {
				ref.current.style.cursor = getCursor(expandDirection, DEFAULT_POINTER)
			}
		}
	}

	const onElementMouseDown = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (!ref.current) {
			return
		}

		const expandDirection = getExpandDirectionByRefAndPosition(ref, e)
		if (
			expandDirection === ExpandDirection.None ||
			(expandDirection & allowedExpandDirections) !== expandDirection
		) {
			return
		}

		expanding.current = true
		expandDirectionRef.current = expandDirection
	}

	const onElementMouseUp = (_: MouseEvent) => {
		if (expanding.current) {
			expanding.current = false
			expandDirectionRef.current = ExpandDirection.None

			if (ref.current) {
				ref.current.style.cursor = getCursor(
					expandDirectionRef.current,
					DEFAULT_POINTER
				)
			}
		}
	}

	const onElementMouseMove = (e: MouseEvent) => {
		if (expanding.current && ref.current) {
			const getCorrectedWidth = (
				xPos: number,
				width: number,
				widthDiff: number
			): number => {
				const proposed = width + widthDiff
				if (maxWidth && xPos + proposed > maxWidth) {
					return maxWidth
				}
				return proposed
			}

			const getCorrectedHeight = (
				yPos: number,
				height: number,
				heightDiff: number
			): number => {
				const proposed = height + heightDiff
				if (maxHeight && yPos + proposed > maxHeight) {
					return maxHeight
				}
				return proposed
			}

			const getCorrectedX = (x: number): number => {
				if (!ref.current) {
					return x
				}

				if (maxWidth && x > maxWidth - ref.current.clientWidth) {
					return maxWidth - ref.current.clientWidth
				}

				return x < 0 ? 1 : x
			}

			const getCorrectedY = (y: number): number => {
				if (!ref.current) {
					return y
				}

				if (maxHeight && y > maxHeight - ref.current.clientHeight) {
					return maxHeight - ref.current.clientHeight
				}

				return y < 0 ? 1 : y
			}

			const rect = ref.current.getBoundingClientRect()

			const originalWidth: number = ref.current.clientWidth
			const originalHeight: number = ref.current.clientHeight
			let newX: number = rect.left
			let newY: number = rect.top
			let newWidth: number = ref.current.clientWidth
			let newHeight: number = ref.current.clientHeight

			if (
				(expandDirectionRef.current & xChangesEnum) ===
				expandDirectionRef.current
			) {
				newX = getCorrectedX(e.clientX)
				newWidth = getCorrectedWidth(
					newX,
					ref.current.clientWidth,
					rect.left - newX
				)
			}

			if (
				(expandDirectionRef.current & yChangesEnum) ===
				expandDirectionRef.current
			) {
				newY = getCorrectedY(e.clientY)
				newHeight = getCorrectedHeight(
					rect.top,
					ref.current.clientHeight,
					rect.top - newY
				)
			}

			if (
				(expandDirectionRef.current & heightChangesEnum) ===
				expandDirectionRef.current
			) {
				newHeight = getCorrectedHeight(
					rect.top,
					ref.current.clientHeight,
					e.clientY - rect.bottom
				)
			}

			if (
				(expandDirectionRef.current & widthChangesEnum) ===
				expandDirectionRef.current
			) {
				newWidth = getCorrectedWidth(
					rect.left,
					ref.current.clientWidth,
					e.clientX - rect.right
				)
			}

			if (newWidth !== originalWidth || newHeight !== originalHeight) {
				if (minWidth && newWidth >= minWidth) {
					ref.current.style.width = `${newWidth}px`
					if (onWidthChanged) {
						onWidthChanged(newWidth)
					}
				}

				if (minHeight && newHeight >= minHeight) {
					ref.current.style.height = `${newHeight}px`
					if (onHeightChanged) {
						onHeightChanged(newHeight)
					}
				}
			}
		}
	}

	useEffect(() => {
		document.addEventListener("mousemove", onElementMouseMove)
		document.addEventListener("mouseup", onElementMouseUp)

		return () => {
			document.removeEventListener("mousemove", onElementMouseMove)
			document.removeEventListener("mouseup", onElementMouseUp)
		}
	}, [onElementMouseMove, onElementMouseUp])

	return (
		<div
			className="expandable"
			ref={ref}
			onMouseOver={onElementMouseOvered}
			onMouseDown={onElementMouseDown}
		>
			{children}
		</div>
	)
}

export default Expandable
