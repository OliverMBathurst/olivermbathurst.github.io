import React, { useEffect, useRef, useState } from 'react'
import SettingsIcon from '../assets/icons/settingsIcon'
import { OSItemType, SystemState, WindowState, WindowType } from '../global/enums'
import { IApplicationHandler, IDragCompletedEvent, IDriveManager, IOSItemClickedEvent, IWindow, IWindowManager, IWindowSize } from '../global/interfaces'
import ApplicationHandler from '../global/utils/handlers/applicationHandler/applicationHandler'
import { isMobileView } from '../global/utils/helpers/mobileHelper'
import DriveManager from '../global/utils/managers/driveManager/driveManager'
import WindowManager from '../global/utils/managers/windowManager/windowManager'
import StartMenu from './components/startMenu/startMenu'
import Desktop from './components/desktop/desktop'
import PowerModal from './components/modals/power/powerModal'
import Overlay from './components/overlay/overlay'
import Window from './components/window/window'
import './styles.scss'

const driveManager: IDriveManager = new DriveManager()
const windowManager: IWindowManager = new WindowManager()
const applicationHandler: IApplicationHandler = new ApplicationHandler()

const System = () => {
    const [windows, setWindows] = useState<IWindow[]>([])
    const [systemState, setSystemState] = useState<SystemState>(SystemState.On)
    const [showOverlay, setShowOverlay] = useState<boolean>(isMobileView())
    const [startMenuShow, setStartMenuShow] = useState(false)

    const startButtonRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === "Escape" && systemState === SystemState.Sleeping) {
                setSystemState(SystemState.On)
            }
        }

        const handleResize = () => {
            var mobileView = isMobileView()
            if (mobileView) {
                if (!showOverlay) {
                    setShowOverlay(true)
                }
            } else {
                if (showOverlay) {
                    setShowOverlay(false)
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("resize", handleResize)
        }
    }, [systemState, showOverlay])

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
                        onFileDoubleClicked)
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
                            onFileDoubleClicked)
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
                        windows={windows}
                        startMenuShow={startMenuShow}
                        startButtonRef={startButtonRef}
                        minimizeAllWindows={() => setWindows(windowManager.minimizeAllWindows())}
                        getHydratedDirectory={driveManager.getHydratedDirectory}
                        onTaskbarItemClicked={(id: string) => setWindows(windowManager.onTaskbarItemClicked(id))}
                        onTaskbarItemDoubleClicked={(id: string) => setWindows(windowManager.onTaskbarItemDoubleClicked(id))}
                        onDesktopItemsDoubleClicked={invokeApplicationHandler}
                        setStartMenuShow={setStartMenuShow}
                    />

                    {windows.filter(w => w.state !== WindowState.Minimized).map(w => {
                        return (
                            <Window
                                key={w.id}
                                window={w}
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
                </> : <div className="off-or-sleep-display" />
            }
        </>)
}

export default System