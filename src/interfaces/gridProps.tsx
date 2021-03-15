import ISnakeCell from "./snakeCell";

export default interface IGridProps {
  grid: ISnakeCell[][] | undefined;
  rowCount: number;
  columnCount: number;
}
