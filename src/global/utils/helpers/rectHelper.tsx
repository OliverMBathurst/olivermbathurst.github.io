import { ILineCoordinates } from "../../interfaces"

export const overlap = (line: ILineCoordinates, target: ILineCoordinates): boolean => {
    if (!line || !target) return false

    var selectionLine = getFormattedLine(line)
    var targetLine = getFormattedLine(target)

    /// x3y3-------x1y1
    /// |           |
    /// |           |
    /// |           |
    /// |           |
    /// x,y--------x2y2


    //if x, y or x1, y1 of target is in selection
    if (targetLine.xy.x >= selectionLine.xy.x && targetLine.xy.x <= selectionLine.x1y1.x
        && targetLine.xy.y >= selectionLine.xy.y && targetLine.xy.y <= selectionLine.x1y1.y) {
        return true
    }

    if (targetLine.x1y1.x >= selectionLine.xy.x && targetLine.x1y1.x <= selectionLine.x1y1.x
        && targetLine.x1y1.y >= selectionLine.xy.y && targetLine.x1y1.y <= selectionLine.x1y1.y) {
        return true
    }

    //if x2y2 or x3y3 of selection is in target or bisection occurs horizontally
    if (selectionLine.xy.x >= targetLine.xy.x && selectionLine.xy.x <= targetLine.x1y1.x
        && selectionLine.x1y1.y >= targetLine.xy.y && selectionLine.x1y1.y <= targetLine.x1y1.y) {
        return true
    }

    if (((selectionLine.x1y1.x >= targetLine.xy.x && selectionLine.x1y1.x <= targetLine.x1y1.x)
        || (selectionLine.xy.x <= targetLine.xy.x && selectionLine.x1y1.x >= targetLine.x1y1.x))
        && selectionLine.xy.y >= targetLine.xy.y && selectionLine.xy.y <= targetLine.x1y1.y) {
        return true
    }

    //if bisection occurs vertically
    if (selectionLine.xy.x >= targetLine.xy.x && selectionLine.x1y1.x <= targetLine.x1y1.x
        && selectionLine.xy.y <= targetLine.xy.y && selectionLine.x1y1.y >= targetLine.x1y1.y) {
        return true
    }

    return false
}

export const getFormattedLine = (line: ILineCoordinates) => {
    var trueXY = {
        x: line.xy.x < line.x1y1.x ? line.xy.x : line.x1y1.x,
        y: line.xy.y < line.x1y1.y ? line.xy.y : line.x1y1.y
    }

    var width = Math.abs(line.xy.x - line.x1y1.x)
    var height = Math.abs(line.xy.y - line.x1y1.y)

    return {
        xy: trueXY,
        x1y1: {
            x: trueXY.x + width,
            y: trueXY.y + height
        }
    }
}