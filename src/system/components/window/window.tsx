import React, { cloneElement, memo, useCallback, useEffect, useRef, useState } from 'react'
import { DEFAULT_WINDOW_HEIGHT, DEFAULT_WINDOW_WIDTH } from '../../../global/constants'
import { HandlerType, WindowState } from '../../../global/enums'
import { ICoordinates, IDragCompletedEvent, IDragHandlerOptions, IExpandHandler, IHandlerManager, IWindow, IWindowSize, IWindowState } from '../../../global/interfaces'
import DragHandler from '../../../global/utils/handlers/dragHandler/dragHandler'
import ExpandHandler from '../../../global/utils/handlers/expandHandler/expandHandler'
import { getMaxWindowHeight, getMaxWindowWidth } from '../../../global/utils/helpers/windowHelper'
import WindowBar from './components/windowBar/windowBar'
import './styles.scss'

interface IWindowProps {
    window: IWindow
    handlerManager: IHandlerManager
    onWindowStateChanged: (id: string, state: WindowState) => void
    onWindowClicked: (id: string) => void
    onWindowSizeChanged: (id: string, size: IWindowSize) => void
    onWindowSelected: (id: string) => void
    onWindowPositionChanged: (completedDrags: IDragCompletedEvent[]) => void
}

const Window = (props: IWindowProps) => {
    const {
        window: windowObj,
        handlerManager,
        onWindowStateChanged,
        onWindowClicked,
        onWindowSizeChanged,
        onWindowSelected,
        onWindowPositionChanged
    } = props

    const containerRef = useRef<HTMLDivElement>(null)
    const windowBarRef = useRef<HTMLDivElement>(null)
    const windowRef = useRef<HTMLDivElement>(null)
    const lastUnmaximizedState = useRef<IWindowState>()
    const [currentState, setCurrentState] = useState<WindowState | null>(null)
    const id = windowObj.id

    useEffect(() => {
        return () => {
            if (handlerManager.handlerExists(id, HandlerType.Drag)) {
                handlerManager.removeHandler(id, HandlerType.Drag)
            }

            if (handlerManager.handlerExists(id, HandlerType.Expand)) {
                handlerManager.removeHandler(id, HandlerType.Expand)
            }
        }
    }, [id, handlerManager])

    useEffect(() => {
        if (!handlerManager.handlerExists(id, HandlerType.Drag)) {
            const dragHandlerOptions: IDragHandlerOptions = {
                id: id,
                elementRef: windowRef,
                reference: windowBarRef,
                onDragStarted: () => onWindowSelected(id),
                onDragComplete: onWindowPositionChanged,
                position: windowObj.position
            }

            handlerManager.addDragHandler(id, new DragHandler(dragHandlerOptions))
        }
    }, [
        id,
        handlerManager,
        onWindowSelected,
        onWindowPositionChanged,
        windowObj.position
    ])

    const changeWindowHeight = useCallback((height: number) => {
        if (windowBarRef.current && windowRef.current && containerRef.current) {
            windowRef.current.style.height = `${height}px`
            containerRef.current.style.height = `${height - windowBarRef.current.clientHeight}px`

            if (windowObj?.size?.width) {
                onWindowSizeChanged(id, { width: windowObj.size.width, height: height })
            }
        }
    }, [id, onWindowSizeChanged, windowObj?.size?.width])

    const changeWindowWidth = useCallback((width: number) => {
        if (windowBarRef.current && windowRef.current && containerRef.current) {
            var newWidth = `${width}px`

            windowBarRef.current.style.width = newWidth

            newWidth = `${windowBarRef.current.getBoundingClientRect().width}px`

            windowRef.current.style.width = newWidth
            containerRef.current.style.width = newWidth

            if (windowObj?.size?.height) {
                onWindowSizeChanged(id, { width: width, height: windowObj.size.height })
            }
        }
    }, [id, onWindowSizeChanged, windowObj?.size?.height])

    const changeWindowPosition = useCallback((x: number, y: number) => {
        if (windowRef && windowRef.current) {
            const rect = windowRef.current.getBoundingClientRect()
            const left = rect.left, top = rect.top

            windowRef.current.style.left = `${x}px`
            windowRef.current.style.top = `${y}px`

            if (left !== x || top !== y) {
                onWindowPositionChanged([{ id: id, position: { x: x, y: y } }])
            }
        }
    }, [id, onWindowPositionChanged])

    const changeWindowSizeAndPosition = useCallback((x: number, y: number, width: number, height: number) => {
        if (windowBarRef.current && windowRef.current && containerRef.current) {
            var correctedY = y >= 0 && y <= window.innerHeight ? y : 0
            var correctedX = x >= 0 && x <= window.innerWidth ? x : 0
            var wMax = getMaxWindowWidth(correctedX), hMax = getMaxWindowHeight(correctedY)

            var newWidth = width > wMax ? wMax : width
            var newHeight = height > hMax ? hMax : height

            changeWindowWidth(newWidth)
            changeWindowHeight(newHeight)

            if (newWidth !== width || newHeight !== height) {
                onWindowSizeChanged(id, { width: newWidth, height: newHeight })
            }

            changeWindowPosition(correctedX, correctedY)
        }
    }, [id, changeWindowWidth, changeWindowHeight, changeWindowPosition, onWindowSizeChanged])

    useEffect(() => {
        if (!handlerManager.handlerExists(id, HandlerType.Expand)) {
            var expandHandler: IExpandHandler = new ExpandHandler(
                windowRef,
                (size: IWindowSize) => {
                    changeWindowHeight(size.height)
                    changeWindowWidth(size.width)
                },
                (position: ICoordinates) => changeWindowPosition(position.x, position.y)
            )
            handlerManager.addExpandHandler(id, expandHandler)
        }
    }, [
        id,
        handlerManager,
        changeWindowHeight,
        changeWindowWidth,
        changeWindowPosition
    ])

    useEffect(() => {
        const handleResize = () => {
            if (windowBarRef.current && windowRef.current && containerRef.current) {
                const { x, y } = windowObj.position

                if (windowObj.state === WindowState.Maximized) {
                    changeWindowSizeAndPosition(0, 0, window.innerWidth, window.innerHeight)
                } else if (windowObj.position) {
                    var newX = getNewX(x), newY = getNewY(y)
                    var maxWidth: number = getMaxWindowWidth(x), maxHeight: number = getMaxWindowHeight(y)

                    if (newX !== x || newY !== y) {
                        changeWindowPosition(newX, newY)
                        maxWidth = getMaxWindowWidth(newX)
                        maxHeight = getMaxWindowHeight(newY)
                    }

                    if (windowObj.size) {
                        if (windowRef.current.clientWidth > maxWidth) {
                            changeWindowWidth(windowObj.size.width > maxWidth ? maxWidth : windowObj.size.width)
                        }

                        if (windowRef.current.clientHeight > maxHeight) {
                            changeWindowHeight(windowObj.size.height > maxHeight ? maxHeight : windowObj.size.height)
                        }
                    } else {
                        onWindowSizeChanged(id, { width: windowRef.current.clientWidth, height: windowRef.current.clientHeight })
                    }
                }
            }
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [
        id,
        windowObj.position,
        windowObj.size,
        windowObj.state,
        changeWindowHeight,
        changeWindowWidth,
        changeWindowPosition,
        changeWindowSizeAndPosition,
        onWindowPositionChanged,
        onWindowSizeChanged
    ])

    useEffect(() => {
        if (windowRef.current && windowBarRef.current && containerRef.current) {
            if (windowObj.state !== currentState) {
                if (windowObj.state !== WindowState.Minimized) {
                    if (windowObj.state === WindowState.Maximized) {
                        changeWindowSizeAndPosition(0, 0, window.innerWidth, window.innerHeight)
                    } else if (windowObj.state === WindowState.Normal && (windowObj.previousState === WindowState.Minimized || windowObj.previousState === WindowState.Maximized) && lastUnmaximizedState.current) {
                        const { position, size } = lastUnmaximizedState.current
                        changeWindowSizeAndPosition(position.x, position.y, size.width, size.height)
                    } else {
                        const { x, y } = windowObj.position
                        const maxWindowWidth = getMaxWindowWidth(x), maxWindowHeight = getMaxWindowHeight(y)

                        if (windowObj.size) {
                            const { width, height } = windowObj.size
                            changeWindowSizeAndPosition(x, y, width > maxWindowWidth ? maxWindowWidth : width, height > maxWindowHeight ? maxWindowHeight : height)
                        }
                    }
                }

                setCurrentState(windowObj.state)
            }
        }
    }, [
        id,
        windowObj.size,
        windowObj.position,
        windowObj.state,
        windowObj.previousState,
        currentState,
        changeWindowSizeAndPosition
    ])

    const getNewX = (initialPositionX: number): number => {
        const maxWidth = getMaxWindowWidth(initialPositionX)
        var newX: number = initialPositionX

        if (windowRef.current && windowBarRef.current && windowRef.current.clientWidth > maxWidth) {
            if (initialPositionX > 0) {
                var diffX = windowRef.current.clientWidth - maxWidth
                newX = initialPositionX >= diffX ? initialPositionX - diffX : 0
            }
        }

        return newX
    }

    const getNewY = (initialPositionY: number): number => {
        const maxHeight = getMaxWindowHeight(initialPositionY)
        var newY: number = initialPositionY

        if (windowRef.current && windowRef.current.clientHeight > maxHeight) {
            if (initialPositionY > 0) {
                var diffY = windowRef.current.clientHeight - maxHeight
                newY = initialPositionY >= diffY ? initialPositionY - diffY : 0
            }
        }

        return newY
    }

    const onWindowStateChangedInternal = (state: WindowState) => {
        if (state === WindowState.Maximized && windowObj.state !== WindowState.Maximized) {
            var size: IWindowSize | undefined = windowObj.size

            if (windowRef && windowRef.current) {
                size = {
                    width: windowRef.current.clientWidth,
                    height: windowRef.current.clientHeight
                }
            } else if (!size) {
                size = {
                    width: DEFAULT_WINDOW_WIDTH,
                    height: DEFAULT_WINDOW_HEIGHT
                }
            }

            lastUnmaximizedState.current = {
                position: windowObj.position,
                size: size
            }
        }

        if (state === WindowState.Maximized && windowObj.state === WindowState.Maximized) {
            state = WindowState.Normal
        }

        onWindowStateChanged(id, state)
    }

    const selectedSuffix = windowObj.selected ? '-selected' : ''

    const windowClassSuffix = windowObj.state === WindowState.Minimized ? '-minimized' : selectedSuffix

    return (
        <div id={`window-${id}`} className={`window${windowClassSuffix}`} ref={windowRef}>
            <WindowBar
                window={windowObj}
                reference={windowBarRef}
                onWindowStateChanged={onWindowStateChangedInternal}
                onWindowClicked={() => onWindowClicked(id)} />
            <div className="window-container" onClick={() => onWindowClicked(id)} ref={containerRef}>
                {cloneElement(windowObj.element, { window: { ...windowObj }})}
            </div>
        </div>)
}

export default memo(Window)