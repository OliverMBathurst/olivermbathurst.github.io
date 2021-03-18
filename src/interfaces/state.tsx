import ICellDescriptor from "./cell";
import ISnake from "./snake";

export default interface IState {
    grid: ICellDescriptor[][];
    snake: ISnake;
    userControlling: boolean;
    timeout: NodeJS.Timeout;
}