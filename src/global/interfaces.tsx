import { OSItemType, WindowState, WindowType } from "./enums";

export interface IWindowSize extends ISize { }

export interface IIdPositionModel extends IIdentifiable, IPositioned { }

export interface IDragCompletedEvent extends IIdentifiable, IPositioned { }

export interface IIdentifiable {
    id: string
}

export interface IPositioned {
    position: ICoordinates
}

export interface ISystemItem extends IIdentifiable {
    type: OSItemType
}

export interface ISpecialDirectory extends IIdentifiable {
    driveId: string
}

export interface IShortcut extends IDesktopDisplayItem {
    link: string
}

export interface IUrlFileContents {
    url: string
}

export interface IPDFFileContents {
    uri: string
}

export interface IIdReferenceModel extends IIdentifiable {
    reference: React.RefObject<HTMLDivElement> | undefined
}

export interface IIdDefinedReferenceModel extends IIdentifiable {
    reference: React.RefObject<HTMLDivElement>
}

interface IDirectory {
    location?: IDirectoryLocationInformation
}

export interface ISize {
    width: number
    height: number
}

export interface ICoordinates {
    x: number
    y: number
}

export interface ILineCoordinates {
    xy: ICoordinates
    x1y1: ICoordinates
}

export interface IOSItemClickedEvent extends IIdentifiable {
    type: OSItemType
    driveId: string | undefined
}

export interface IIconProps {
    width?: number
    height?: number
}

export interface IApplicationHandler {
    invoke: (file: IFile | undefined) => IWindow | null
    invokeDirectoryHandler: (
        hydratedDirectory: IHydratedDirectory | undefined,
        getHydratedDirectory: (id: string, driveId: string | undefined) => IHydratedDirectory | undefined,
        onFileDoubleClicked: (id: string, driveId: string | undefined) => void) => IWindow | null
}

export interface IDesktopDisplayItem extends IDesktopItem, IDriveItem, ISystemItem {
    reference?: React.RefObject<HTMLDivElement>
    initialPosition?: ICoordinates
}

interface IDesktopItem extends IIdentifiable {
    position?: ICoordinates
    icon?: JSX.Element
}

export interface IDirectoryLocationInformation {
    parentId?: string
    root?: boolean
}

export interface IStartMenuItem {
    name: string
    onClick?: () => void
    icon: JSX.Element
}

export interface IFileSystem {
    root: IVirtualDirectory
    getFolder: (path: string) => IVirtualDirectory
    getFile: (filePath: string) => IFile
}

export interface IDriveItem {
    driveId?: string
    name: string
    extension?: string
}

export interface IFile extends IDesktopDisplayItem {
    name: string
    contents: any
    windowParams?: IWindowParams
}

export interface IHydratedDirectory extends IDirectory, IDesktopDisplayItem {
    files: (IFile | undefined)[]
    directories: (IHydratedDirectory | undefined)[]
    shortcuts: (IShortcut | undefined)[]
}

export interface IVirtualDirectory extends IDirectory, IDesktopDisplayItem {
    files: string[]
    directories: string[]
    shortcuts: string[]
    position?: ICoordinates
}

export interface IIdHelper {
    getNewDriveId: () => string
    getNewFileId: (driveId: string) => string
    getNewDirectoryId: (driveId: string) => string
    getNewShortcutId: (driveId: string) => string
}

export interface IWindowParams {
    name?: string
    position?: ICoordinates
    state?: WindowState
    size?: IWindowSize
    icon?: JSX.Element
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

export interface IDragHandlerOptions extends IIdentifiable {
    elementRef?: React.RefObject<HTMLDivElement>
    movingRef: React.RefObject<HTMLDivElement> | undefined
    selectedItemsGroup?: IIdReferenceModel[]
    onDragComplete?: (events: IDragCompletedEvent[]) => void
    onDragStarted?: () => void
    onClickOccurred?: (event: MouseEvent) => void
    onDoubleClickOccurred?: () => void
    position?: ICoordinates
}

export interface IWindow extends IIdentifiable {
    name: string
    position: ICoordinates
    state: WindowState
    size?: IWindowSize
    type: WindowType
    selected: boolean
    element: JSX.Element
    icon?: JSX.Element
}

export interface IWindowManager {
    windows: IWindow[]
    windowCount: number
    onWindowSelected: (id: string) => IWindow[]
    onWindowStateChanged: (id: string, state: WindowState) => IWindow[]
    onWindowClicked: (id: string) => IWindow[]
    onWindowSizeChanged: (id: string, size: IWindowSize) => IWindow[]
    onWindowPositionChanged: (completedDrags: IDragCompletedEvent[]) => IWindow[]
    addWindow: (window: IWindow) => IWindow[]
    onTaskbarItemClicked: (id: string) => IWindow[]
    onTaskbarItemDoubleClicked: (id: string) => IWindow[]
    minimizeAllWindows: () => IWindow[]
}

export interface IDragHandler extends IIdentifiable {
    elementRef?: React.RefObject<HTMLDivElement>
    movingRef: React.RefObject<HTMLDivElement> | undefined
    selectedItemsGroup?: IIdReferenceModel[]
    onDragComplete?: (events: IDragCompletedEvent[]) => void
    onClickOccurred?: (event: MouseEvent) => void
    positions?: IIdPositionModel[]
    removeListeners: () => void
    dragStartEventFired: boolean
    draggingHasStarted: boolean
    offsetX: number
    offsetY: number
    setListeners: () => void
    setOptions: (options: IDragHandlerOptions) => void
}

export interface IDrive extends ISystemItem {
    letter: string
    primary: boolean
    fileRepository: Map<string, IFile>
    virtualDirectoryRepository: Map<string, IVirtualDirectory>
    shortcutRepository: Map<string, IShortcut>
    addOrUpdateFile: (file: IFile) => void
    addOrUpdateDirectory: (virtualDirectory: IVirtualDirectory) => void
    addOrUpdateShortcut: (shortcut: IShortcut) => void
    addOrUpdateFiles: (files: IFile[]) => void
    addOrUpdateDirectories: (virtualDirectories: IVirtualDirectory[]) => void
    addOrUpdateShortcuts: (shortcuts: IShortcut[]) => void
}