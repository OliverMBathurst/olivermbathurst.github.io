import ICellDescriptor from "./cellDescriptor";
import ISnake from "./snake";

export default interface IState {
    grid: ICellDescriptor[][];
    snake: ISnake;
    userControlling: boolean;
    timeout: NodeJS.Timeout;
    windowResizeTimeout: NodeJS.Timeout | null;
    paused: boolean;
    debug: boolean;
}