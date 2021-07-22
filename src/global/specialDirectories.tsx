import { ISpecialDirectory } from "./interfaces"

declare global {
    var desktopDirectory: ISpecialDirectory | null
}

globalThis.desktopDirectory = null

export {}