import React, { memo, useCallback, useContext, useRef, useState } from 'react'
import { FILETYPE_RENDERABLE_PROPERTY } from '../../constants'
import { WindowsContext } from '../../contexts'
import { ISize, IWindowProperties, WindowState } from '../../interfaces/windows'
import { Visibility } from '../../types'
import { WindowTopBar } from './components'
import './window.scss'

interface IWindowProps {
    properties: IWindowProperties
}

const Window = (props: IWindowProps) => {
    const {
        properties: {
            id,
            fileInfo,
            size,
            state
        },
    } = props

    const [previousSize, setPreviousSize] = useState<ISize>(size)
    const [currentSize, setCurrentSize] = useState<ISize>(size)

    const windowRef = useRef<HTMLDivElement | null>(null)
    const windowPositionRef = useRef<{ x: number, y: number } | undefined>(undefined)
    const windowPreviousPositioning = useRef<{ top: string, left: string }>({ top: "50%", left: "50%" })
    const windowIsMovingRef = useRef<boolean>(false)

    const { removeWindow, onWindowStateChanged, onWindowSelected } = useContext(WindowsContext)
    const { width, height } = currentSize

    const onMaximiseButtonClicked = (_: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        if (state === WindowState.Maximised) {
            let div = windowRef.current
            if (div) {
                div.style.top = windowPreviousPositioning.current.top
                div.style.left = windowPreviousPositioning.current.left
            }
            setCurrentSize(previousSize)
            onWindowStateChanged(id, WindowState.Normal)
        } else {
            let div = windowRef.current
            if (div) {
                div.style.top = "50%"
                div.style.left = "50%"
            }
            setPreviousSize(currentSize)
            setCurrentSize({ width: "100%", height: "100%" })
            onWindowStateChanged(id, WindowState.Maximised)
        }
    }

    const onMinimiseButtonClicked = (_: React.MouseEvent<HTMLImageElement, MouseEvent>) => onWindowStateChanged(id, WindowState.Minimised)

    const onCloseButtonClicked = useCallback((_: React.MouseEvent<HTMLImageElement, MouseEvent>) => removeWindow(id), [removeWindow, id])

    const onWindowTopBarMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        onWindowSelected(id)

        windowPositionRef.current = {
            x: e.clientX,
            y: e.clientY
        }

        windowIsMovingRef.current = true

        window.onmousemove = onWindowTopBarMouseMove
    }

    const onWindowTopBarMouseUp = (_: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        windowIsMovingRef.current = false
        window.onmousemove = null

        if (windowRef.current) {
            windowPreviousPositioning.current = {
                top: windowRef.current.style.top,
                left: windowRef.current.style.left
            }
        }
    }

    const onWindowContentMouseOvered = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
        windowIsMovingRef.current = false
        window.onmousemove = null
    }

    const onWindowTopBarMouseMove = (e: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!windowIsMovingRef.current) {
            return
        }

        if (windowPositionRef.current) {
            e.preventDefault();
            let pos1 = windowPositionRef.current.x - e.clientX;
            let pos2 = windowPositionRef.current.y - e.clientY;
            windowPositionRef.current.x = e.clientX;
            windowPositionRef.current.y = e.clientY;

            let div = windowRef.current
            if (div) {
                div.style.top = (div.offsetTop - pos2) / 16 + "rem";
                div.style.left = (div.offsetLeft - pos1) / 16 + "rem";

                if (state === WindowState.Maximised) {
                    onWindowStateChanged(id, WindowState.Normal)
                }
            }
        }
    }

    const Content = useCallback(() => {
        if (FILETYPE_RENDERABLE_PROPERTY in fileInfo) {
            return fileInfo.render()
        }

        return null
    }, [fileInfo])

    const visibility: Visibility = state === WindowState.Minimised
        ? "hidden"
        : "visible"

    return (
        <div
            className="window"
            style={{
                height: height,
                width: width,
                visibility: visibility,
            }}
            ref={windowRef}
        >
            <WindowTopBar
                fileInfo={fileInfo}
                onWindowTopBarMouseMove={onWindowTopBarMouseMove}
                onWindowTopBarMouseUp={onWindowTopBarMouseUp}
                onWindowTopBarMouseDown={onWindowTopBarMouseDown}
                onMaximiseButtonClicked={onMaximiseButtonClicked}
                onMinimiseButtonClicked={onMinimiseButtonClicked}
                onCloseButtonClicked={onCloseButtonClicked}
            />
            <div className="window__content" onMouseOver={onWindowContentMouseOvered}>
                <Content />
            </div>
        </div>)
}

export default memo(Window)