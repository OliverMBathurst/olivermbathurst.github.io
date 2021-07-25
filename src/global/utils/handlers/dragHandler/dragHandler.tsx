import { MARGIN_BOTTOM } from '../../../constants'
import { ICoordinates, IDragCompletedEvent, IDragHandler, IDragHandlerOptions, IIdPositionModel, IIdReferenceModel } from '../../../interfaces'

let lastClickFire: number = 0

class DragHandler implements IDragHandler {
    id: string
    elementRef: React.RefObject<HTMLDivElement> | undefined
    movingRef: React.RefObject<HTMLDivElement> | undefined
    selectedItemsGroup?: IIdReferenceModel[]
    onDragComplete?: (events: IDragCompletedEvent[]) => void
    onDragStarted?: () => void
    onClickOccurred?: (event: MouseEvent) => void
    onDoubleClickOccurred?: () => void
    positions?: IIdPositionModel[]
    dragStartEventFired: boolean = false
    draggingHasStarted: boolean = false
    hasDragged: boolean = false
    offsetX: number = 0
    offsetY: number = 0
    absX: number = 0
    absY: number = 0
    
    constructor(options: IDragHandlerOptions) {
        this.id = options.id
        this.setOptions(options)
        this.setListeners()
    }

    setListeners = () => {
        if (this.movingRef && this.movingRef.current) {
            this.movingRef.current.addEventListener('mousedown', this.onMouseDown)
        }

        document.addEventListener('mouseup', this.onMouseUp)
        document.addEventListener('mousemove', this.onMouseMove)
    }

    setOptions = (options: IDragHandlerOptions) => {
        const {
            id,
            elementRef,
            movingRef,
            selectedItemsGroup,
            onDragComplete,
            onDragStarted,
            onClickOccurred,
            onDoubleClickOccurred,
            position
        } = options

        this.id = id
        this.elementRef = elementRef ?? movingRef
        this.movingRef = movingRef
        this.selectedItemsGroup = selectedItemsGroup
        this.onDragComplete = onDragComplete
        this.onDragStarted = onDragStarted
        this.onClickOccurred = onClickOccurred
        this.onDoubleClickOccurred = onDoubleClickOccurred

        if (position) {
            var { x, y } = position
            this.absX = x
            this.absY = y
            this.setPositionByRef(x, y, movingRef)
        }
    }

    onMouseUp = (event: MouseEvent) => {
        if (this.draggingHasStarted && !this.hasDragged && this.onClickOccurred) {
            this.onClickOccurred(event)
            return
        }

        if (this.onDragComplete && this.draggingHasStarted) {
            var dragEvent = { id: this.id, position: { x: this.absX, y: this.absY } }

            var completedDrags: IDragCompletedEvent[] = [dragEvent]
            if (this.selectedItemsGroup && this.positions) {
                for (const selectedItem of this.selectedItemsGroup) {
                    var pos = this.positions.find(x => x.id === selectedItem.id)?.position
                    if (pos) {
                        completedDrags.push({ id: selectedItem.id, position: pos })
                    }
                }
            }

            this.onDragComplete(completedDrags)
        }

        this.dragStartEventFired = false
        this.draggingHasStarted = false
    }

    onMouseDown = (event: MouseEvent) => {
        if (event.button !== 0) return
        event.preventDefault()

        var seconds = new Date().getTime() / 1000
        var diff = Math.abs(seconds - lastClickFire)
        lastClickFire = seconds

        if (diff < 1) {
            if (this.onDoubleClickOccurred) {
                this.onDoubleClickOccurred()
            }
        }

        if (!this.movingRef) {
            return
        }

        var rect = this.movingRef.current?.getBoundingClientRect()
        if (!rect) return

        this.offsetX = event.clientX - rect.left
        this.offsetY = event.clientY - rect.top

        this.absX = rect.left
        this.absY = rect.top

        this.draggingHasStarted = true
    }

    onMouseMove = (event: MouseEvent) => {
        if (!this.elementRef || !this.elementRef.current || !this.draggingHasStarted) return
        event.preventDefault()

        if (!this.dragStartEventFired && this.onDragStarted) {
            this.onDragStarted()
            this.dragStartEventFired = true
        }

        var newAbsX = event.clientX - this.offsetX
        var newAbsY = event.clientY - this.offsetY

        var diffX = newAbsX - this.absX
        var diffY = newAbsY - this.absY

        var { x, y } = this.getNewCoordinates(newAbsX, newAbsY, this.elementRef, this.movingRef)

        this.absX = x
        this.absY = y

        this.setPositionByRef(x, y, this.elementRef)

        if (this.selectedItemsGroup) {
            this.positions = []
            for (var selectedItem of this.selectedItemsGroup) {
                if (!selectedItem.reference || !selectedItem.reference.current) continue

                var otherRefRect = selectedItem.reference.current.getBoundingClientRect()

                var { x: selectedItemX, y: selectedItemY } = this.getNewCoordinates(
                    otherRefRect.left + diffX,
                    otherRefRect.top + diffY,
                    selectedItem.reference)

                this.setPositionByRef(selectedItemX, selectedItemY, selectedItem.reference)
                this.positions.push({ id: selectedItem.id, position: { x: selectedItemX, y: selectedItemY }})
            }
        }

        this.hasDragged = true
    }

    getNewCoordinates = (
        x: number,
        y: number,
        reference: React.RefObject<HTMLDivElement>,
        _movingRef?: React.RefObject<HTMLDivElement>): ICoordinates => {

        _movingRef = _movingRef ?? reference

        if (!reference || !reference.current) return { x: x, y: y }

        if (x < 0) {
            x = 0
        } else if (x + reference.current.clientWidth > window.innerWidth) {
            x = window.innerWidth - reference.current.clientWidth
        }

        if (!_movingRef || !_movingRef.current) return { x: x, y: y }

        var rect = _movingRef.current.getBoundingClientRect()
        if (!rect) return { x: x, y: y }

        if (y < 0) {
            y = 0
        } else if (y + reference.current.clientHeight > window.innerHeight - MARGIN_BOTTOM) {
            y = window.innerHeight - reference.current.clientHeight - MARGIN_BOTTOM
        }

        return { x: x, y: y }
    }

    setPositionByRef = (x: number, y: number, reference: React.RefObject<HTMLDivElement> | undefined) => {
        if (reference && reference.current) {
            reference.current.style.left = x + "px"
            reference.current.style.top = y + "px"
        }
    }

    removeListeners = () => {
        if (this.movingRef && this.movingRef.current) {
            this.movingRef.current.removeEventListener('mousedown', this.onMouseDown)
        }

        document.removeEventListener('mouseup', this.onMouseUp)
        document.removeEventListener('mousemove', this.onMouseMove)
    }
}

export default DragHandler