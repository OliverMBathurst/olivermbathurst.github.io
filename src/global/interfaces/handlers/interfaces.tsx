import { ICoordinates, IDragCompletedEvent, IFile, IHydratedDirectory, IIdentifiable, IIdPositionModel, IIdReferenceModel, IWindow } from "..";

export interface IExpandHandler {
    removeListeners: () => void
}

export interface IApplicationHandler {
    invoke: (file: IFile | undefined) => IWindow | null
    invokeDirectoryHandler: (
        hydratedDirectory: IHydratedDirectory | undefined,
        getHydratedDirectory: (id: string, driveId: string | undefined) => IHydratedDirectory | undefined,
        onFileDoubleClicked: (id: string, driveId: string | undefined) => void,
        onWindowNameChanged: (id: string, newName: string) => void) => IWindow | null
}

export interface IClickHandler {
    onMouseDownOccurred?: (event: MouseEvent) => void
    onClickOccurred?: (event: MouseEvent) => void
    onDoubleClickOccurred?: () => void
    removeListeners: () => void
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

export interface IDragHandlerOptions extends IIdentifiable {
    elementRef?: React.RefObject<HTMLDivElement>
    reference: React.RefObject<HTMLDivElement> | undefined
    selectedItemsGroup?: IIdReferenceModel[]
    onDragComplete?: (events: IDragCompletedEvent[]) => void
    onDragStarted?: () => void
    position?: ICoordinates
}

export interface IClickHandlerOptions extends IIdentifiable {
    reference: React.RefObject<HTMLDivElement> | undefined
    onMouseDownOccurred?: (event: MouseEvent) => void
    onClickOccurred?: (event: MouseEvent) => void
    onDoubleClickOccurred?: () => void
}