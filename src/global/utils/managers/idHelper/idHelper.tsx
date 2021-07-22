import { IIdHelper } from "../../../interfaces"

class IdHelper implements IIdHelper {
    private driveCount: number = 0
    private fileCount: number = 0
    private directoryCount: number = 0
    private shortcutCount: number = 0

    getNewDriveId = (): string => {
        this.driveCount++
        return `drive-${this.driveCount}`
    }

    getNewFileId = (driveId: string): string => {
        this.fileCount++
        return `${driveId}-file-${this.fileCount}`
    }

    getNewDirectoryId = (driveId: string): string => {
        this.directoryCount++
        return `${driveId}-directory-${this.directoryCount}`
    }

    getNewShortcutId = (driveId: string): string => {
        this.shortcutCount++
        return `${driveId}-shortcut-${this.shortcutCount}`
    }
}

export default IdHelper