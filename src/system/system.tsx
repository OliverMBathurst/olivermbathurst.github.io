import React, { useEffect, useRef, useState } from 'react'
import SettingsIcon from '../assets/icons/settingsIcon'
import { OSItemType, SystemState, WindowState, WindowType } from '../global/enums'
import { IApplicationHandler, IDragCompletedEvent, IDriveManager, IHandlerManager, IIdHelper, IOSItemClickedEvent, IWindow, IWindowManager, IWindowSize } from '../global/interfaces'
import ApplicationHandler from '../global/utils/handlers/applicationHandler/applicationHandler'
import IdHelper from '../global/utils/helpers/idHelper'
import DriveManager from '../global/utils/managers/driveManager/driveManager'
import HandlerManager from '../global/utils/managers/handlerManager/handlerManager'
import WindowManager from '../global/utils/managers/windowManager/windowManager'
import Desktop from './components/desktop/desktop'
import PowerModal from './components/modals/power/powerModal'
import Overlay from './components/overlay/overlay'
import StartMenu from './components/startMenu/startMenu'
import TaskbarItem from './components/taskbar/components/taskbarItem/taskbarItem'
import Taskbar from './components/taskbar/taskbar'
import Window from './components/window/window'
import './styles.scss'

const idHelper: IIdHelper = new IdHelper()
const driveManager: IDriveManager = new DriveManager(idHelper)
const windowManager: IWindowManager = new WindowManager(idHelper)
const applicationHandler: IApplicationHandler = new ApplicationHandler()
const handlerManager: IHandlerManager = new HandlerManager()

const System = () => {
    const [windows, setWindows] = useState<IWindow[]>([])
    const [systemState, setSystemState] = useState<SystemState>(SystemState.On)
    const [showOverlay, setShowOverlay] = useState<boolean>(true)
    const [startMenuShow, setStartMenuShow] = useState(false)

    const startButtonRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === "Escape" && systemState === SystemState.Sleeping) {
                setSystemState(SystemState.On)
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [systemState, showOverlay, startMenuShow])

    const invokeApplicationHandler = (events: IOSItemClickedEvent[]) => {
        for (const event of events) {
            var win: IWindow | null = null

            const { id, type, driveId } = event

            const onFileDoubleClicked = (fileId: string, fileDriveId: string | undefined) => {
                if (fileId && fileDriveId) {
                    var e = { driveId: fileDriveId, type: OSItemType.File } as IOSItemClickedEvent
                    e.id = fileId
                    invokeApplicationHandler([e])
                }
            }

            switch (type) {
                case OSItemType.Directory:
                    win = applicationHandler.invokeDirectoryHandler(
                        driveManager.getHydratedDirectory(id, driveId),
                        driveManager.getHydratedDirectory,
                        onFileDoubleClicked,
                        (windowId: string, newName: string) => setWindows(windowManager.onWindowNameChanged(windowId, newName)))
                    break
                case OSItemType.File:
                    win = applicationHandler.invoke(driveManager.getFile(id, driveId))
                    break
                case OSItemType.DirectoryShortcut:
                    var directoryShortcut = driveManager.getShortcut(id, driveId)
                    if (directoryShortcut) {
                        win = applicationHandler.invokeDirectoryHandler(
                            driveManager.getHydratedDirectory(directoryShortcut.link, driveId),
                            driveManager.getHydratedDirectory,
                            onFileDoubleClicked,
                            (windowId: string, newName: string) => setWindows(windowManager.onWindowNameChanged(windowId, newName)))
                    }
                    break
                case OSItemType.FileShortcut:
                    var fileShortcut = driveManager.getShortcut(id, driveId)
                    if (fileShortcut) {
                        win = applicationHandler.invoke(driveManager.getFile(fileShortcut.link, driveId))
                    }
                    break
            }

            if (win) {
                windowManager.addWindow(win)
            }
        }
       
        setWindows(windowManager.windows)
    }

    const onPowerButtonClicked = () => {
        var win: IWindow = {
            id: 'window-temp',
            name: 'Power',
            state: WindowState.Normal,
            selected: true,
            type: WindowType.Settings,
            position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
            icon: <SettingsIcon />,
            element: (
                <PowerModal
                    sleep={() => setSystemState(SystemState.Sleeping)}
                    restart={() => window.location.reload()}
                    shutdown={() => setSystemState(SystemState.Off)}
                />)
        }

        windowManager.addWindow(win)
        setWindows(windowManager.windows)
    }

    return (
        <>
            {systemState === SystemState.On ?
                <>
                    {showOverlay &&
                        <Overlay onClick={() => setShowOverlay(false)} />
                    }
                    
                    <Desktop
                        handlerManager={handlerManager}
                        getHydratedDirectory={driveManager.getHydratedDirectory}
                        onDesktopItemsDoubleClicked={invokeApplicationHandler}
                    />

                    {windows.map(w => {
                        return (
                            <Window
                                key={w.id}
                                window={w}
                                handlerManager={handlerManager}
                                onWindowSelected={(id) => setWindows(windowManager.onWindowSelected(id))}
                                onWindowStateChanged={(id: string, state: WindowState) => setWindows(windowManager.onWindowStateChanged(id, state))}
                                onWindowClicked={(id: string) => setWindows(windowManager.onWindowClicked(id))}
                                onWindowSizeChanged={(id: string, size: IWindowSize) => setWindows(windowManager.onWindowSizeChanged(id, size))}
                                onWindowPositionChanged={(completedDrags: IDragCompletedEvent[]) => setWindows(windowManager.onWindowPositionChanged(completedDrags))} />)
                    })}

                    {startMenuShow &&
                        <StartMenu
                            onPowerButtonClicked={onPowerButtonClicked}
                            onNavigateAway={() => setStartMenuShow(false)}
                            getAllFiles={driveManager.getAllFiles}
                            onStartMenuItemClicked={(event) => invokeApplicationHandler([event])}
                            startButtonRef={startButtonRef}
                        />
                    }

                    <Taskbar
                        startButtonRef={startButtonRef}
                        onMinimizeAllClicked={() => setWindows(windowManager.minimizeAllWindows())}
                        onStartButtonClicked={() => setStartMenuShow(!startMenuShow)}
                    >
                        {windows.map(w => {
                            return (
                                <TaskbarItem
                                    key={w.id}
                                    window={w}
                                    onTaskbarItemClicked={(id: string) => setWindows(windowManager.onTaskbarItemClicked(id))}
                                    onTaskbarItemDoubleClicked={(id: string) => setWindows(windowManager.onTaskbarItemDoubleClicked(id))} />)
                        })}
                    </Taskbar>
                </> : <div className="off-or-sleep-display" />
            }
        </>)
}

export default System