import { WindowExpandDirection } from "../enums"

export const xChangesEnum =
	WindowExpandDirection.Left |
	WindowExpandDirection.TopLeft |
	WindowExpandDirection.BottomLeft
export const yChangesEnum =
	WindowExpandDirection.Top |
	WindowExpandDirection.TopRight |
	WindowExpandDirection.TopLeft
export const heightChangesEnum =
	WindowExpandDirection.Bottom |
	WindowExpandDirection.BottomRight |
	WindowExpandDirection.BottomLeft
export const widthChangesEnum =
	WindowExpandDirection.Right |
	WindowExpandDirection.TopRight |
	WindowExpandDirection.BottomRight

export const getExpandDirectionByRefAndPosition = (
	ref: React.RefObject<HTMLDivElement | null>,
	e: React.MouseEvent<HTMLDivElement, MouseEvent> | MouseEvent
) => {
	let expandDirection: WindowExpandDirection = WindowExpandDirection.None
	if (ref && ref.current) {
		const rect = ref.current.getBoundingClientRect()

		const getWithinBounds = (a: number, b: number): boolean =>
			Math.abs(Math.round(a) - Math.round(b)) <= 3

		if (rect) {
			if (getWithinBounds(e.clientY, rect.top)) {
				if (getWithinBounds(e.clientX, rect.left)) {
					expandDirection = WindowExpandDirection.TopLeft
				} else if (getWithinBounds(e.clientX, rect.right)) {
					expandDirection = WindowExpandDirection.TopRight
				} else {
					expandDirection = WindowExpandDirection.Top
				}
			} else if (getWithinBounds(e.clientY, rect.bottom)) {
				if (getWithinBounds(e.clientX, rect.left)) {
					expandDirection = WindowExpandDirection.BottomLeft
				} else if (getWithinBounds(e.clientX, rect.right)) {
					expandDirection = WindowExpandDirection.BottomRight
				} else {
					expandDirection = WindowExpandDirection.Bottom
				}
			} else if (
				getWithinBounds(e.clientX, rect.left) &&
				e.clientY > rect.top &&
				e.clientY < rect.bottom
			) {
				expandDirection = WindowExpandDirection.Left
			} else if (
				getWithinBounds(e.clientX, rect.right) &&
				e.clientY > rect.top &&
				e.clientY < rect.bottom
			) {
				expandDirection = WindowExpandDirection.Right
			}
		}
	}

	return expandDirection
}

export const getCursor = (
	direction: WindowExpandDirection,
	defaultCursor: string
): string => {
	switch (direction) {
		case WindowExpandDirection.BottomLeft:
		case WindowExpandDirection.TopRight:
			return "nesw-resize"
		case WindowExpandDirection.BottomRight:
		case WindowExpandDirection.TopLeft:
			return "nwse-resize"
		case WindowExpandDirection.Bottom:
		case WindowExpandDirection.Top:
			return "ns-resize"
		case WindowExpandDirection.Left:
		case WindowExpandDirection.Right:
			return "ew-resize"
		default:
			return defaultCursor
	}
}
