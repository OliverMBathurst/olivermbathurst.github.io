import { CSSProperties } from "react";
import { CellType } from "../enums/cellType";

export default interface ICellDescriptor {
  type: CellType;
  style: CSSProperties;
  cellClass: string;
}
