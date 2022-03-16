import { DESKTOP_ICON_HEIGHT, DESKTOP_ICON_PADDING_LEFT, DESKTOP_ICON_WIDTH } from "../../constants/window"
import { ICoordinates } from "../../interfaces"

export const getAvailableGridPositions = (): ICoordinates[] => {
    var availablePositions: ICoordinates[] = []
    var totalY = DESKTOP_ICON_HEIGHT
    var totalX = DESKTOP_ICON_WIDTH + DESKTOP_ICON_PADDING_LEFT

    var width = Math.floor(window.innerWidth / totalX)
    var height = Math.floor(window.innerHeight / totalY)

    for (var j = 0; j < width; j++) {
        for (var i = 0; i < height; i++) {
            availablePositions.push({ x: j * totalX, y: i * totalY })
        }
    }

    return availablePositions
}