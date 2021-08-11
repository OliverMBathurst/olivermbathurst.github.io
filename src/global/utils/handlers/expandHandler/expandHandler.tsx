import { MARGIN_BOTTOM, WINDOW_MIN_HEIGHT } from "../../../constants"
import { ExpandDirection } from "../../../enums"
import { ICoordinates, IExpandHandler, IRectangle, IWindowSize } from "../../../interfaces"
import { getMaxWindowHeight, getMaxWindowWidth } from "../../helpers/windowHelper"

class ExpandHandler implements IExpandHandler {
    private elementRef: React.RefObject<HTMLDivElement> | null
    private onWindowPositionChanged: (coordinates: ICoordinates) => void
    private onWindowSizeChanged: (size: IWindowSize) => void
    private expanding: boolean = false
    private expandInitialRect: IRectangle | null = null
    private expandDirection: ExpandDirection = ExpandDirection.Right

    private xChangesEnum = ExpandDirection.Left | ExpandDirection.TopLeft | ExpandDirection.BottomLeft
    private yChangesEnum = ExpandDirection.Top | ExpandDirection.TopRight | ExpandDirection.TopLeft
    private heightChangesEnum = ExpandDirection.Bottom | ExpandDirection.BottomRight | ExpandDirection.BottomLeft
    private widthChangesEnum = ExpandDirection.Right | ExpandDirection.TopRight | ExpandDirection.BottomRight

    private bottomRightConsts = ExpandDirection.TopLeft | ExpandDirection.Left | ExpandDirection.Top
    private bottomLeftConsts = ExpandDirection.TopRight | ExpandDirection.Right | ExpandDirection.Top
    private topRightConsts = ExpandDirection.BottomLeft | ExpandDirection.Left | ExpandDirection.Bottom
    private topLeftConst = ExpandDirection.BottomRight | ExpandDirection.Right | ExpandDirection.Bottom

    constructor(
        elementRef: React.RefObject<HTMLDivElement> | null,
        onWindowSizeChanged: (size: IWindowSize) => void,
        onWindowPositionChanged: (coordinates: ICoordinates) => void)
    {
        this.elementRef = elementRef
        this.onWindowSizeChanged = onWindowSizeChanged
        this.onWindowPositionChanged = onWindowPositionChanged
        this.setListeners()
    }

    onMouseUp = (event: MouseEvent) => {
        if (this.expanding) {
            this.expanding = false
        }
    }

    onMouseDown = (event: MouseEvent) => {
        if (this.elementRef && this.elementRef.current) {
            const rect = this.elementRef.current.getBoundingClientRect()
            if (this.getWithinBounds(event.clientX, rect.left)
                || this.getWithinBounds(event.clientX, rect.right)
                || this.getWithinBounds(event.clientY, rect.bottom)
                || this.getWithinBounds(event.clientY, rect.top)) {
                this.expanding = true
                this.expandInitialRect = {
                    topLeft: { x: rect.left, y: rect.top },
                    topRight: { x: rect.right, y: rect.top },
                    bottomLeft: { x: rect.left, y: rect.bottom },
                    bottomRight: { x: rect.right, y: rect.bottom }
                }
            }
        }
    }

    onMouseMove = (event: MouseEvent) => {
        if (this.expanding && this.elementRef && this.elementRef.current) {
            const rect = this.elementRef.current.getBoundingClientRect()

            const originalWidth: number = this.elementRef.current.clientWidth, originalHeight: number = this.elementRef.current.clientHeight
            var newX: number = rect.left, newY: number = rect.top
            var newWidth: number = this.elementRef.current.clientWidth, newHeight: number = this.elementRef.current.clientHeight

            if ((this.expandDirection & this.xChangesEnum) === this.expandDirection) {
                newX = this.getCorrectedX(event.x)
                newWidth = this.getCorrectedWidth(newX, this.elementRef.current.clientWidth, rect.left - newX)
            }

            if ((this.expandDirection & this.yChangesEnum) === this.expandDirection) {
                newY = this.getCorrectedY(event.y)
                newHeight = this.getCorrectedHeight(rect.top, this.elementRef.current.clientHeight, rect.top - newY)
            }

            if ((this.expandDirection & this.heightChangesEnum) === this.expandDirection) {
                newHeight = this.getCorrectedHeight(rect.top, this.elementRef.current.clientHeight, event.y - rect.bottom)
            }

            if ((this.expandDirection & this.widthChangesEnum) === this.expandDirection) {
                newWidth = this.getCorrectedWidth(rect.left, this.elementRef.current.clientWidth, event.x - rect.right)
            }

            var legalMove: boolean = false

            if (this.expandInitialRect) {
                if ((this.expandDirection & this.bottomRightConsts) === this.expandDirection) {
                    legalMove = newX + newWidth <= this.expandInitialRect.bottomRight.x && rect.bottom === this.expandInitialRect.bottomRight.y
                } else if ((this.expandDirection & this.bottomLeftConsts) === this.expandDirection) {
                    legalMove = newX === this.expandInitialRect.bottomLeft.x && rect.bottom === this.expandInitialRect.bottomLeft.y
                } else if ((this.expandDirection & this.topRightConsts) === this.expandDirection) {
                    legalMove = newX + newWidth <= this.expandInitialRect.topRight.x && rect.top === this.expandInitialRect.topRight.y
                } else if ((this.expandDirection & this.topLeftConst) === this.expandDirection) {
                    legalMove = newX === this.expandInitialRect.topLeft.x && rect.top === this.expandInitialRect.topLeft.y
                }
            }
            
            if (((newWidth !== originalWidth) || (newHeight !== originalHeight)) && legalMove) {
                this.onWindowSizeChanged({ width: newWidth, height: newHeight })

                var changedWidth = this.elementRef.current.clientWidth
                var changedHeight = this.elementRef.current.clientHeight

                if (changedWidth === newWidth && changedHeight === newHeight) {
                    this.onWindowPositionChanged({ x: newX, y: newY })
                }
            }
        }
    }

    onMouseOver = (event: MouseEvent) => {
        if (this.elementRef && this.elementRef.current && !this.expanding) {
            const rect = this.elementRef.current.getBoundingClientRect()
            if (rect) {
                if (this.getWithinBounds(event.clientY, rect.top)) {
                    if (this.getWithinBounds(event.clientX, rect.left)) {
                        this.expandDirection = ExpandDirection.TopLeft
                    } else if (this.getWithinBounds(event.clientX, rect.right)) {
                        this.expandDirection = ExpandDirection.TopRight
                    } else {
                        this.expandDirection = ExpandDirection.Top
                    }
                } else if (this.getWithinBounds(event.clientY, rect.bottom)) {
                    if (this.getWithinBounds(event.clientX, rect.left)) {
                        this.expandDirection = ExpandDirection.BottomLeft
                    } else if (this.getWithinBounds(event.clientX, rect.right)) {
                        this.expandDirection = ExpandDirection.BottomRight
                    } else {
                        this.expandDirection = ExpandDirection.Bottom
                    }
                } else if (this.getWithinBounds(event.clientX, rect.left) && event.clientY > rect.top && event.clientY < rect.bottom) {
                    this.expandDirection = ExpandDirection.Left
                } else if (this.getWithinBounds(event.clientX, rect.right) && event.clientY > rect.top && event.clientY < rect.bottom) {
                    this.expandDirection = ExpandDirection.Right
                }

                this.elementRef.current.style.cursor = this.getCursor(this.expandDirection)
            }
        }
    }

    removeListeners = () => {
        if (this.elementRef && this.elementRef.current) {
            this.elementRef.current.removeEventListener('mousedown', this.onMouseDown)
            this.elementRef.current.removeEventListener('mouseover', this.onMouseOver)
        }

        document.removeEventListener('mouseup', this.onMouseUp)
        document.removeEventListener('mousemove', this.onMouseMove)
    }

    private getCursor = (direction: ExpandDirection): string => {
        switch (direction) {
            case ExpandDirection.BottomLeft:
            case ExpandDirection.TopRight:
                return 'nesw-resize'
            case ExpandDirection.BottomRight:
            case ExpandDirection.TopLeft:
                return 'nwse-resize'
            case ExpandDirection.Bottom:
            case ExpandDirection.Top:
                return 'ns-resize'
            case ExpandDirection.Left:
            case ExpandDirection.Right:
                return 'ew-resize'
            default:
                return 'ew-resize'
        }
    }

    private getCorrectedWidth = (xPos: number, width: number, widthDiff: number): number => {
        var proposed = width + widthDiff
        var mx = getMaxWindowWidth(xPos)
        return proposed > mx ? mx : proposed
    }

    private getCorrectedHeight = (yPos: number, height: number, heightDiff: number): number => {
        var proposed = height + heightDiff
        var mx = getMaxWindowHeight(yPos)

        if (proposed < WINDOW_MIN_HEIGHT) {
            return WINDOW_MIN_HEIGHT
        }

        return proposed > mx ? mx : proposed
    }

    private getCorrectedX = (x: number): number => {
        if (!this.elementRef || !this.elementRef.current) {
            return x
        }

        if (x > window.innerWidth - this.elementRef.current.clientWidth) {
            return window.innerWidth - this.elementRef.current.clientWidth
        }

        return x < 0 ? 1 : x
    }

    private getCorrectedY = (y: number): number => {
        if (!this.elementRef || !this.elementRef.current) {
            return y
        }

        if (y > (window.innerHeight - MARGIN_BOTTOM - this.elementRef.current.clientHeight)) {
            return window.innerHeight - MARGIN_BOTTOM - this.elementRef.current.clientHeight
        }

        return y < 0 ? 1 : y
    }

    private getWithinBounds = (a: number, b: number): boolean => Math.abs(Math.round(a) - Math.round(b)) <= 1

    private setListeners = () => {
        if (this.elementRef && this.elementRef.current) {
            this.elementRef.current.addEventListener('mousedown', this.onMouseDown)
            this.elementRef.current.addEventListener('mouseover', this.onMouseOver)
        }

        document.addEventListener('mouseup', this.onMouseUp)
        document.addEventListener('mousemove', this.onMouseMove)
    }
}

export default ExpandHandler