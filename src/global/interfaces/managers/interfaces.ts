import { IClickHandler, IDragCompletedEvent, IDragHandler, IDrive, IExpandHandler, IFile, IHydratedDirectory, IIdDefinedReferenceModel, IShortcut, IVirtualDirectory, IWindow, IWindowSize } from "..";
import { WindowHandlerType, WindowState } from "../../enums";

export interface IHandlerManager {
    addDragHandler: (id: string, handler: IDragHandler) => void
    setDragHandlerSelected: (id: string, selected: IIdDefinedReferenceModel[]) => void
    addClickHandler: (id: string, handler: IClickHandler) => void
    addExpandHandler: (id: string, handler: IExpandHandler) => void
    handlerExists: (id: string, type: WindowHandlerType) => boolean
    removeHandler: (id: string, type: WindowHandlerType) => void
}

export interface IDriveManager {
    drives: IDrive[]
    getPrimaryDrive: () => IDrive | undefined
    getAllFiles: () => IFile[]
    getHydratedDirectory: (id: string, driveId: string | undefined) => IHydratedDirectory | undefined
    getDirectory: (id: string, driveId: string | undefined) => IVirtualDirectory | undefined
    getShortcut: (id: string, driveId: string | undefined) => IShortcut | undefined
    getFile: (id: string, driveId: string | undefined) => IFile | undefined
}

export interface IWindowManager {
    windows: IWindow[]
    onWindowSelected: (id: string) => IWindow[]
    onWindowStateChanged: (id: string, state: WindowState) => IWindow[]
    onWindowClicked: (id: string) => IWindow[]
    onWindowSizeChanged: (id: string, size: IWindowSize) => IWindow[]
    onWindowPositionChanged: (completedDrags: IDragCompletedEvent[]) => IWindow[]
    addWindow: (window: IWindow) => IWindow[]
    onTaskbarItemClicked: (id: string) => IWindow[]
    onTaskbarItemDoubleClicked: (id: string) => IWindow[]
    minimizeAllWindows: () => IWindow[]
    onWindowNameChanged: (id: string, newName: string) => IWindow[]
}