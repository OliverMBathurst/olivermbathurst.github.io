import { JSX } from "react"

export type FileInfo = IGenericFile | IUrlShortcutFile

export interface IFile {
    name: string
    extension: string
}

export interface IGenericFile extends IFile, IWindowFile { }

export interface IUrlShortcutFile extends IFile {
    url: string
}

export interface IWindowRenderProps {
    onMouseOver?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

export interface IWindowFile {
    render: (props?: IWindowRenderProps) => JSX.Element
}