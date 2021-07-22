import { OSItemType } from '../../../../../enums'
import { ICoordinates, IDirectoryLocationInformation, IVirtualDirectory } from '../../../../../interfaces'

class VirtualDirectory implements IVirtualDirectory {
    id: string
    name: string
    type: OSItemType = OSItemType.Directory
    files: string[]
    directories: string[]
    shortcuts: string[]
    position?: ICoordinates
    location?: IDirectoryLocationInformation

    constructor(
        id: string,
        name: string,
        files: string[],
        directories: string[],
        shortcuts: string[],
        position?: ICoordinates,
        location?: IDirectoryLocationInformation)
    {
        this.id = id
        this.name = name
        this.files = files
        this.directories = directories
        this.shortcuts = shortcuts
        this.position = position
        this.location = location
    }
    

    hasChildren = (): boolean => this.directories.length > 0
}

export default VirtualDirectory