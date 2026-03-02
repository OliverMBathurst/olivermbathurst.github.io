import { Context } from "../../types/fs"

interface IWindowed {
    id: string
}

interface IBaseTaskbarItem {
    handlerId: string
    context: Context
    index: number
}

export interface ITaskbarItem extends IBaseTaskbarItem, IWindowed {
    selected: boolean
}

export interface IPinnedTaskbarItem extends IBaseTaskbarItem {
    fullName: string
}