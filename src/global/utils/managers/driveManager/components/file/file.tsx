import { OSItemType } from "../../../../../enums"
import { IFile, IWindowParams } from "../../../../../interfaces"

class File implements IFile {
    id: string
    name: string
    type: OSItemType = OSItemType.File
    extension: string
    contents: any
    windowParams?: IWindowParams
    reference?: React.RefObject<HTMLDivElement>

    constructor(
        id: string,
        name: string,
        extension: string,
        contents: any,
        windowParams?: IWindowParams)
    {
        this.id = id
        this.name = name
        this.extension = extension
        this.contents = contents
        this.windowParams = windowParams
    }
}

export default File