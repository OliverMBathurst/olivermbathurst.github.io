import IGrid from "./grid";
import ISnake from "./snake";

export default interface IState {
  grid: IGrid;
  snake: ISnake;
  userControlling: boolean;
  timeout: NodeJS.Timeout;
  windowResizeTimeout: NodeJS.Timeout | null;
  paused: boolean;
  debug: boolean;
}
