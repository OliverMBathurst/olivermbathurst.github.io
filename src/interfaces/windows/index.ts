import { Node } from "../../types/fs"

export interface IWindowProperties {
    id: string
    context: Node
    selected: boolean
    size: ISize
    state: WindowState
    previousState: WindowState | null
}

export interface IAddWindowProperties {
    context: Node
    selected: boolean
    size?: ISize
}

export enum WindowState {
    Normal,
    Minimised,
    Maximised
}

export interface ISize {
    width: string
    height: string
}

export interface IPosition {
    top: string
    left: string
}