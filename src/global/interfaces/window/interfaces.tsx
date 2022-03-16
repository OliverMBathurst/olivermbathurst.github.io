import { ICoordinates, IIdentifiable, ISize } from "..";
import { WindowState, WindowType } from "../../enums";

export interface IWindowParams {
    name?: string
    position?: ICoordinates
    state?: WindowState
    size?: IWindowSize
    icon?: JSX.Element
}

export interface IWindow extends IIdentifiable {
    name: string
    position: ICoordinates
    state: WindowState
    previousState?: WindowState
    size?: IWindowSize
    type: WindowType
    selected: boolean
    element: JSX.Element
    icon?: JSX.Element
}

export interface IWindowState {
    position: ICoordinates
    size: IWindowSize
}

export interface IWindowSize extends ISize { }