import { OSItemType } from "../../../../../enums";
import { IDrive, IDriveItem, IFile, IShortcut, IVirtualDirectory } from "../../../../../interfaces";

class Drive implements IDrive {
    id: string
    letter: string
    primary: boolean
    type: OSItemType = OSItemType.Drive
    fileRepository: Map<string, IFile> = new Map()
    virtualDirectoryRepository: Map<string, IVirtualDirectory> = new Map()
    shortcutRepository: Map<string, IShortcut> = new Map()

    constructor(id: string, letter: string, primary: boolean) {
        this.id = id
        this.letter = letter
        this.primary = primary
    }

    addOrUpdateFile = (file: IFile) => this.fileRepository.set(file.id, file)

    addOrUpdateDirectory = (virtualDirectory: IVirtualDirectory) => this.virtualDirectoryRepository.set(virtualDirectory.id, virtualDirectory)

    addOrUpdateShortcut = (shortcut: IShortcut) => this.shortcutRepository.set(shortcut.id, shortcut)

    addOrUpdateFiles = (files: IFile[]) => {
        this.setDriveIdOnItems(files)
        for (var file of files) {
            this.fileRepository.set(file.id, file)
        }
    }

    addOrUpdateDirectories = (virtualDirectories: IVirtualDirectory[]) => {
        this.setDriveIdOnItems(virtualDirectories)
        for (var directory of virtualDirectories) {
            this.virtualDirectoryRepository.set(directory.id, directory)
        }
    }

    addOrUpdateShortcuts = (shortcuts: IShortcut[]) => {
        this.setDriveIdOnItems(shortcuts)
        for (var shortcut of shortcuts) {
            this.shortcutRepository.set(shortcut.id, shortcut)
        }
    }

    private setDriveIdOnItems = (driveItems: IDriveItem[]) => {
        for (var item of driveItems) {
            item.driveId = this.id
        }
    }
}

export default Drive