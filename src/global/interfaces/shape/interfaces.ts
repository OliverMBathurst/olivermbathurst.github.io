export interface IRectangle {
    topLeft: ICoordinates
    topRight: ICoordinates
    bottomLeft: ICoordinates
    bottomRight: ICoordinates
}

export interface ILineCoordinates {
    xy: ICoordinates
    x1y1: ICoordinates
}

export interface ICoordinates {
    x: number
    y: number
}

export interface ISize {
    width: number
    height: number
}