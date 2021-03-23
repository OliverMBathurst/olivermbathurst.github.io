import ICellDescriptor from "../interfaces/cellDescriptor";
import IGrid from "../interfaces/grid";
import { CellType } from "../enums/cellType";
import { FoodChance, cellClasses } from "../constants";

export default class GridHelper {
  static getNewGrid = (width: number, height: number): IGrid => {
    var newGrid: ICellDescriptor[][] = [];
    var foodCount: number = 0;

    for (var i = 0; i < height; i++) {
      newGrid[i] = [];
      for (var j = 0; j < width; j++) {
        var cellType =
          Math.random() > FoodChance ? CellType.Food : CellType.Normal;
        if (cellType === CellType.Food) {
          foodCount++;
        }

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

    return {
      cells: newGrid,
      foodCount: foodCount,
      height: height,
      width: width
    };
  };
}
