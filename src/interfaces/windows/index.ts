import { Context } from "../../types/fs"

export interface IWindowProperties {
	id: string
	context: Context
	selected: boolean
	size: ISize
	state: WindowState
	previousState: WindowState | null
}

export interface IAddWindowProperties {
	context: Context
	selected: boolean
	size?: ISize
}

export enum WindowState {
	Normal,
	Minimised,
	Maximised,
}

export interface ISize {
	width: string
	height: string
}

export interface IPosition {
	top: string
	left: string
}
