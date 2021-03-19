import ICellDescriptor from "../interfaces/cellDescriptor";
import { CellType } from "../enums/cellType";
import { FoodChance, cellClasses } from "../constants";

export default class GridHelper {
  static getNewGrid = (width: number, height: number): ICellDescriptor[][] => {
    var newGrid: ICellDescriptor[][] = [];
    for (var i = 0; i < height; i++) {
      newGrid[i] = [];
      for (var j = 0; j < width; j++) {
        var cellType =
          Math.random() > FoodChance ? CellType.Food : CellType.Normal;
        var style =
          cellType === CellType.Food
            ? { opacity: Math.random() > 0.5 ? 1 : 0.5 }
            : {};

        newGrid[i][j] = {
          type: cellType,
          cellClass: cellClasses[cellType],
          style: style,
        };
      }
    }
    return newGrid;
  };
}
