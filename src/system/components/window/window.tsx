import React, { memo, useEffect, useRef } from 'react'
import { WindowState } from '../../../global/enums'
import { IDragCompletedEvent, IDragHandlerOptions, IWindow, IWindowSize } from '../../../global/interfaces'
import DragHandler from '../../../global/utils/handlers/dragHandler/dragHandler'
import { getMaxWindowHeight, getMaxWindowWidth } from '../../../global/utils/helpers/windowHelper'
import WindowBar from './components/windowBar/windowBar'
import './styles.scss'

interface IWindowProps {
    window: IWindow
    onWindowStateChanged: (id: string, state: WindowState) => void
    onWindowClicked: (id: string) => void
    onWindowSizeChanged: (id: string, size: IWindowSize) => void
    onWindowSelected: (id: string) => void
    onWindowPositionChanged: (completedDrags: IDragCompletedEvent[]) => void
}

const Window = (props: IWindowProps) => {
    const {
        window: windowObj,
        onWindowStateChanged,
        onWindowClicked,
        onWindowSizeChanged,
        onWindowSelected,
        onWindowPositionChanged
    } = props

    const containerRef = useRef<HTMLDivElement>(null)
    const windowBarRef = useRef<HTMLDivElement>(null)
    const windowRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const dragHandlerOptions: IDragHandlerOptions = {
            id: windowObj.id,
            elementRef: windowRef,
            movingRef: windowBarRef,
            onDragStarted: () => onWindowSelected(windowObj.id),
            onDragComplete: onWindowPositionChanged,
            position: windowObj.position
        }

        var dragHandler = new DragHandler(dragHandlerOptions)
        return () => dragHandler.removeListeners()
    }, [])

    useEffect(() => {
        if (windowRef.current && windowBarRef.current && containerRef.current) {
            const { x, y } = windowObj.position

            windowRef.current.style.top = `${y}px`
            windowRef.current.style.left = `${x}px`

            var maxWindowWidth = getMaxWindowWidth(x)
            var maxWindowHeight = getMaxWindowHeight(y)

            if (windowObj.size) {
                const { width, height } = windowObj.size

                var overX = width > maxWindowWidth
                var overY = height > maxWindowHeight

                maxWindowWidth = overX ? maxWindowWidth : width
                maxWindowHeight = overY ? maxWindowHeight : height

                windowRef.current.style.width = `${overX ? maxWindowWidth : width}px`
                windowRef.current.style.height = `${overY ? maxWindowHeight : height}px`
            }

            containerRef.current.style.maxHeight = `${maxWindowHeight - windowBarRef.current.clientHeight}px`

            windowRef.current.style.maxWidth = `${maxWindowWidth}px`
            windowRef.current.style.maxHeight = `${maxWindowHeight}px`

            if (windowObj.state === WindowState.Maximized) {
                windowRef.current.style.width = `${maxWindowWidth}px`
                windowRef.current.style.height = `${maxWindowHeight}px`
                containerRef.current.style.height = `${maxWindowHeight - windowBarRef.current.clientHeight}px`
            }
        }
    }, [windowObj.id, windowObj.size, windowObj.position])

    return (
        <div id={`window-${windowObj.id}`} className={`window${windowObj.selected ? '-selected' : ''}`} ref={windowRef}>
            <WindowBar
                window={windowObj}
                reference={windowBarRef}
                onWindowStateChanged={onWindowStateChanged}
                onWindowClicked={onWindowClicked} />
            <div className="window-container" onClick={() => onWindowClicked(windowObj.id)} ref={containerRef}>
                {windowObj.element}
            </div>
        </div>)
}

export default memo(Window)