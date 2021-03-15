import { CellType } from "../enums/cellType";
import { Direction } from "../enums/direction";

export default interface ISnakeCell {
  type: CellType;
  direction: Direction;
}
