import { FileInfo } from "../file"

export interface IWindowProperties {
    id: string
    fileInfo: FileInfo
    selected: boolean
    size: ISize
    state: WindowState
    previousState: WindowState | null
}

export interface IAddWindowProperties {
    fileInfo: FileInfo
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