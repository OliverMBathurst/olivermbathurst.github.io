import { MARGIN_BOTTOM } from "../../constants/window"

export const getMaxWindowHeight = (yOffset: number): number => window.innerHeight - yOffset - MARGIN_BOTTOM

export const getMaxWindowWidth = (xOffset: number): number => window.innerWidth - xOffset