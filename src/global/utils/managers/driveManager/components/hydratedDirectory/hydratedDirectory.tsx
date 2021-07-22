import { OSItemType } from "../../../../../enums";
import { IHydratedDirectory, IFile, IShortcut, IDirectoryLocationInformation } from "../../../../../interfaces";

class HydratedDirectory implements IHydratedDirectory {
    id: string
    name: string
    driveId: string
    type: OSItemType = OSItemType.Directory
    files: (IFile | undefined)[]
    directories: (IHydratedDirectory | undefined)[]
    shortcuts: (IShortcut | undefined)[]
    location?: IDirectoryLocationInformation

    constructor(
        id: string,
        name: string,
        driveId: string,
        files: (IFile | undefined)[],
        directories: (IHydratedDirectory | undefined)[],
        shortcuts: (IShortcut | undefined)[],
        location?: IDirectoryLocationInformation)
    {
        this.id = id
        this.name = name
        this.driveId = driveId
        this.files = files
        this.directories = directories
        this.shortcuts = shortcuts
        this.location = location
    }
}

export default HydratedDirectory