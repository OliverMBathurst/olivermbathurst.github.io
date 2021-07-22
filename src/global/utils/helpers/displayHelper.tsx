import DirectoryIcon from '../../../assets/icons/directoryIcon'
import DirectoryShortcutIcon from '../../../assets/icons/directoryShortcutIcon'
import FileIcon from '../../../assets/icons/fileIcon'
import FileShortcutIcon from '../../../assets/icons/fileShortcutIcon'
import { OSItemType } from "../../enums"

export const getDisplayIcon = (type: OSItemType, width: number = 48, height: number = 48) => {
    var props = { width: width, height: height }
    switch (type) {
        case OSItemType.Directory:
            return <DirectoryIcon {...props} />
        case OSItemType.DirectoryShortcut:
            return <DirectoryShortcutIcon {...props} />
        case OSItemType.File:
            return <FileIcon {...props} />
        case OSItemType.FileShortcut:
            return <FileShortcutIcon {...props} />
        default:
            return <FileIcon {...props} />
    }
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