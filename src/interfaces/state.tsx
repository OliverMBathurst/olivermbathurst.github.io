import ICell from "./cell";
import ISnake from "./snake";

export default interface IState {
    grid: ICell[][];
    snake: ISnake;
    userControlling: boolean;
    timeout: NodeJS.Timeout;
}