import IGrid from "./grid";
import ISnake from "./snake";
import IGridChange from "./gridChange";

export default interface IState {
  grid: IGrid;
  snake: ISnake;
  gridChanges?: IGridChange[];
  userControlling: boolean;
  timeout: NodeJS.Timeout;
  windowResizeTimeout: NodeJS.Timeout | null;
  paused: boolean;
  debug: boolean;
}
