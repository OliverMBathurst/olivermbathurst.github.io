import { OSItemType } from "../../../../../enums"
import { ICoordinates, IShortcut } from "../../../../../interfaces"

class Shortcut implements IShortcut {
    id: string
    name: string
    link: string
    type: OSItemType
    position?: ICoordinates
    icon?: JSX.Element

    constructor(
        id: string,
        name: string,
        link: string,
        type: OSItemType,
        position?: ICoordinates,
        icon?: JSX.Element)
    {
        this.id = id
        this.name = name
        this.link = link
        this.type = type
        this.position = position
        this.icon = icon
    }
}

export default Shortcut