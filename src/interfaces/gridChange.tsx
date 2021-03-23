import ICoordinates from "../interfaces/coordinates";
import ICellDescriptor from "../interfaces/cellDescriptor";

export default interface IGridChange {
  coordinates: ICoordinates;
  cell: ICellDescriptor;
}
