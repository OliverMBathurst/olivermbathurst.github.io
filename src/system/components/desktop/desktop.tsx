import React from 'react'
import { IHydratedDirectory, IOSItemClickedEvent, IWindow } from '../../../global/interfaces'
import DesktopGrid from './components/desktopGrid/desktopGrid'
import TaskbarItem from './components/taskbar/components/taskbarItem/taskbarItem'
import Taskbar from './components/taskbar/taskbar'
import Wallpaper from './components/wallpaper/wallpaper'
import './styles.scss'

interface IDesktopProps {
    windows: IWindow[]
    startMenuShow: boolean
    startButtonRef: React.RefObject<HTMLDivElement>
    onTaskbarItemClicked: (id: string) => void
    onTaskbarItemDoubleClicked: (id: string) => void
    onDesktopItemsDoubleClicked: (events: IOSItemClickedEvent[]) => void
    minimizeAllWindows: () => void
    getHydratedDirectory: (id: string, driveId: string | undefined) => IHydratedDirectory | undefined
    setStartMenuShow: (show: boolean) => void
}

const Desktop = (props: IDesktopProps) => {
    const {
        windows,
        startMenuShow,
        startButtonRef,
        onTaskbarItemClicked,
        onTaskbarItemDoubleClicked,
        minimizeAllWindows,
        onDesktopItemsDoubleClicked,
        getHydratedDirectory,
        setStartMenuShow
    } = props

    return (
        <div className="desktop">
            <Wallpaper />
            <DesktopGrid
                getHydratedDirectory={getHydratedDirectory}
                onDesktopItemsDoubleClicked={onDesktopItemsDoubleClicked}
            />

            <Taskbar
                startButtonRef={startButtonRef}
                onMinimizeAllClicked={minimizeAllWindows}
                onStartButtonClicked={() => setStartMenuShow(!startMenuShow)}
            >
                {windows.map(w => {
                    return (<TaskbarItem
                                key={w.id}
                                window={w}
                                onTaskbarItemClicked={onTaskbarItemClicked}
                                onTaskbarItemDoubleClicked={onTaskbarItemDoubleClicked} />)
                })}
            </Taskbar>
        </div>)
}

export default Desktop