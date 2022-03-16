import { DirectoryIcon, FileIcon, FileShortcutIcon } from '../../../assets/icons'
import { OSItemType, WindowType } from "../../enums"

export const getDisplayIcon = (type: OSItemType, width: number = 48, height: number = 48) => {
    var props = { width: width, height: height }
    switch (type) {
        case OSItemType.DirectoryShortcut:
        case OSItemType.Directory:
            return <DirectoryIcon {...props} />
        case OSItemType.File:
            return <FileIcon {...props} />
        case OSItemType.FileShortcut:
            return <FileShortcutIcon {...props} />
        default:
            return <FileIcon {...props} />
    }
}

export const getWindowDisplayIcon = (type: WindowType, width: number = 20, height: number = 20) => {
    return getDisplayIcon(type === WindowType.Directory ? OSItemType.Directory : OSItemType.File, width, height)
}

export const getDisplayName = (type: OSItemType, name: string | undefined, extension: string | undefined) => {
    var newName = `${name ? name : ""}${extension ? extension : ""}`

    switch (type) {
        case OSItemType.DirectoryShortcut:
        case OSItemType.FileShortcut:
            newName += ` (Shortcut)`
    }

    return newName
}