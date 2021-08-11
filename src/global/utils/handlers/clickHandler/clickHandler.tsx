import { IClickHandler, IClickHandlerOptions, ICoordinates } from '../../../interfaces'

class ClickHandler implements IClickHandler {
    private lastClickFire: number = 0
    id: string
    reference: React.RefObject<HTMLDivElement> | undefined
    onMouseDownOccurred?: (event: MouseEvent) => void
    onClickOccurred?: (event: MouseEvent) => void
    onDoubleClickOccurred?: () => void
    hasClicked: boolean = false
    mouseDownPos: ICoordinates | undefined

    constructor(options: IClickHandlerOptions) {
        this.id = options.id
        this.setOptions(options)
        this.setListeners()
    }

    setListeners = () => {
        if (this.reference && this.reference.current) {
            this.reference.current.addEventListener('mousedown', this.onMouseDown)
        }

        document.addEventListener('mouseup', this.onMouseUp)
    }

    setOptions = (options: IClickHandlerOptions) => {
        const {
            id,
            reference,
            onMouseDownOccurred,
            onClickOccurred,
            onDoubleClickOccurred
        } = options

        this.id = id
        this.reference = reference
        this.onMouseDownOccurred = onMouseDownOccurred
        this.onClickOccurred = onClickOccurred
        this.onDoubleClickOccurred = onDoubleClickOccurred
    }

    onMouseUp = (event: MouseEvent) => {
        if (this.hasClicked) {
            if (event.button !== 0) return
            event.preventDefault()

            var seconds = new Date().getTime() / 1000
            var diff = Math.abs(seconds - this.lastClickFire)
            this.lastClickFire = seconds

            if (diff < 1 && this.onDoubleClickOccurred) {
                this.onDoubleClickOccurred()
            } else if (this.onClickOccurred && diff > 1) {
                if (this.mouseDownPos) {
                    const { x, y } = this.mouseDownPos
                    if (x === event.clientX && y === event.clientY) {
                        this.onClickOccurred(event)
                    }
                }
            }

            this.hasClicked = false
        }
    }

    onMouseDown = (event: MouseEvent) => {
        this.mouseDownPos = { x: event.clientX, y: event.clientY }
        if (this.onMouseDownOccurred) {
            this.onMouseDownOccurred(event)
        }
        this.hasClicked = true
    }

    removeListeners = () => {
        if (this.reference && this.reference.current) {
            this.reference.current.removeEventListener('mousedown', this.onMouseDown)
        }

        document.removeEventListener('mouseup', this.onMouseUp)
    }
}

export default ClickHandler