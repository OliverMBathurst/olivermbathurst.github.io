export interface IIdHelper {
    getNewWindowId: () => string
    getNewDriveId: () => string
    getNewFileId: (driveId: string) => string
    getNewDirectoryId: (driveId: string) => string
    getNewShortcutId: (driveId: string) => string
}