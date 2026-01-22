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
	openNewInstance?: boolean
	selected?: boolean
	size?: ISize
}

export enum WindowState {
	Normal,
	Minimised,
	Maximised
}

export interface ISize {
	width: number
	height: number
}

export interface IPosition {
	x: number
	y: number
}
