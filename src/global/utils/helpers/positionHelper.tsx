import { ICoordinates } from "../../interfaces";
import { getMaxWindowHeight, getMaxWindowWidth } from "./windowHelper";

export const isValidPosition = (position: ICoordinates | undefined, width: number, height: number) =>
    position && (position.x + width >= 0 && position.x + width <= getMaxWindowWidth(0))
    && (position.y + height >= 0 && position.y + height <= getMaxWindowHeight(0))