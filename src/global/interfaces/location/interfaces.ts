export interface IPositioned {
    position: ICoordinates
}

export interface ICoordinates {
    x: number
    y: number
}

export interface ILineCoordinates {
    xy: ICoordinates
    x1y1: ICoordinates
}