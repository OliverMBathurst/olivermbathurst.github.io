import { ICoordinates, IDesktopDisplayItem, IIdentifiable, IWindowParams } from "..";
import { OSItemType } from "../../enums";

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

export interface IDirectory {
    location?: IDirectoryLocationInformation
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

export interface IGenericFileContents {
    element: JSX.Element
}

export interface IFile extends IDesktopDisplayItem {
    name: string
    contents: any
    windowParams?: IWindowParams
}

export interface IDirectoryLocationInformation {
    parentId?: string
    root?: boolean
}

export interface ISpecialDirectory extends IIdentifiable {
    driveId: string
}

export interface ISystemItem extends IIdentifiable {
    type: OSItemType
}

export interface IShortcut extends IDesktopDisplayItem {
    link: string
}

export interface IUrlFileContents {
    url: string
}