import ICell from "./cell";

export default interface IGridProps {
  grid: ICell[][] | undefined;
  rowCount: number;
  columnCount: number;
}
