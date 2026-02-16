import { Context } from "../../types/fs"

export interface IWindowProperties {
	id: string
	context: Context
	selected: boolean
	size: ISize
	state: WindowState
	previousState: WindowState | null
	handlerId: string
	arguments?: string
}

export interface IAddWindowProperties {
	context: Context
	handlerId: string
	openNewInstance?: boolean
	selected?: boolean
	size?: ISize
	arguments?: string
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
