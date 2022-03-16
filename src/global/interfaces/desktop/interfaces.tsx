import { ICoordinates, IDriveItem, IIdentifiable, ISystemItem } from "..";

export interface IDesktopDisplayItem extends IDesktopItem, IDriveItem, ISystemItem {
    reference?: React.RefObject<HTMLDivElement>
    initialPosition?: ICoordinates
}

export interface IDesktopItem extends IIdentifiable {
    position?: ICoordinates
    icon?: JSX.Element
}

export interface IStartMenuItem {
    name: string
    onClick?: () => void
    icon: JSX.Element
}