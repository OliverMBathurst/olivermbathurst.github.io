import { ExpandDirection } from "../enums"

export const xChangesEnum =
	ExpandDirection.Left | ExpandDirection.TopLeft | ExpandDirection.BottomLeft
export const yChangesEnum =
	ExpandDirection.Top | ExpandDirection.TopRight | ExpandDirection.TopLeft
export const heightChangesEnum =
	ExpandDirection.Bottom |
	ExpandDirection.BottomRight |
	ExpandDirection.BottomLeft
export const widthChangesEnum =
	ExpandDirection.Right | ExpandDirection.TopRight | ExpandDirection.BottomRight

export const getExpandDirectionByRefAndPosition = (
	ref: React.RefObject<HTMLDivElement | null>,
	e: React.MouseEvent<HTMLDivElement, MouseEvent> | MouseEvent
) => {
	let expandDirection: ExpandDirection = ExpandDirection.None
	if (ref && ref.current) {
		const rect = ref.current.getBoundingClientRect()

		const getWithinBounds = (a: number, b: number): boolean =>
			Math.abs(Math.round(a) - Math.round(b)) <= 3

		if (rect) {
			if (getWithinBounds(e.clientY, rect.top)) {
				if (getWithinBounds(e.clientX, rect.left)) {
					expandDirection = ExpandDirection.TopLeft
				} else if (getWithinBounds(e.clientX, rect.right)) {
					expandDirection = ExpandDirection.TopRight
				} else {
					expandDirection = ExpandDirection.Top
				}
			} else if (getWithinBounds(e.clientY, rect.bottom)) {
				if (getWithinBounds(e.clientX, rect.left)) {
					expandDirection = ExpandDirection.BottomLeft
				} else if (getWithinBounds(e.clientX, rect.right)) {
					expandDirection = ExpandDirection.BottomRight
				} else {
					expandDirection = ExpandDirection.Bottom
				}
			} else if (
				getWithinBounds(e.clientX, rect.left) &&
				e.clientY > rect.top &&
				e.clientY < rect.bottom
			) {
				expandDirection = ExpandDirection.Left
			} else if (
				getWithinBounds(e.clientX, rect.right) &&
				e.clientY > rect.top &&
				e.clientY < rect.bottom
			) {
				expandDirection = ExpandDirection.Right
			}
		}
	}

	return expandDirection
}

export const getCursor = (
	direction: ExpandDirection,
	defaultCursor: string
): string => {
	switch (direction) {
		case ExpandDirection.BottomLeft:
		case ExpandDirection.TopRight:
			return "nesw-resize"
		case ExpandDirection.BottomRight:
		case ExpandDirection.TopLeft:
			return "nwse-resize"
		case ExpandDirection.Bottom:
		case ExpandDirection.Top:
			return "ns-resize"
		case ExpandDirection.Left:
		case ExpandDirection.Right:
			return "ew-resize"
		default:
			return defaultCursor
	}
}
