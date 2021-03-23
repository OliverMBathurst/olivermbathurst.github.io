import ICellDescriptor from "./cellDescriptor";

export default interface IGrid {
  cells: ICellDescriptor[][];
  foodCount: number;
  height: number;
  width: number;
}
