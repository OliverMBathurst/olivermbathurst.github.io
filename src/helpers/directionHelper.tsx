import { Direction } from "../enums/direction";
import { CellType } from "../enums/cellType";
import ICellDescriptor from "../interfaces/cellDescriptor";
import ICoordinates from "../interfaces/coordinates";

export default class DirectionHelper {
  static getNextDirection = (
    headCoordinates: ICoordinates,
    direction: Direction,
    grid: ICellDescriptor[][]
  ): Direction => {
    if (grid) {
      var foundFood: boolean = false;

      switch (direction) {
        case Direction.Down:
          foundFood = DirectionHelper.isFoodDown(headCoordinates, grid);
          break;
        case Direction.Left:
          foundFood = DirectionHelper.isFoodLeft(headCoordinates, grid);
          break;
        case Direction.Right:
          foundFood = DirectionHelper.isFoodRight(headCoordinates, grid);
          break;
        case Direction.Up:
          foundFood = DirectionHelper.isFoodUp(headCoordinates, grid);
          break;
      }

      if (!foundFood) {
        return DirectionHelper.getRandomNextDirection(
          headCoordinates,
          direction,
          grid
        );
      } else {
        return direction;
      }
    }

    return Direction.Up;
  };

  static getRandomNextDirection = (
    coordinates: ICoordinates,
    excludedDirection: Direction,
    grid: ICellDescriptor[][]
  ): Direction => {
    var allDirections: Direction[] = [
      Direction.Down,
      Direction.Left,
      Direction.Right,
      Direction.Up,
    ];

    allDirections.splice(allDirections.indexOf(excludedDirection), 1);

    var foodDirections: Direction[] = [];

    for (var dir of allDirections) {
      if (
        dir === Direction.Down &&
        DirectionHelper.isFoodDown(coordinates, grid)
      ) {
        foodDirections.push(Direction.Down);
      } else if (
        dir === Direction.Up &&
        DirectionHelper.isFoodUp(coordinates, grid)
      ) {
        foodDirections.push(Direction.Up);
      } else if (
        dir === Direction.Right &&
        DirectionHelper.isFoodRight(coordinates, grid)
      ) {
        foodDirections.push(Direction.Right);
      } else if (
        dir === Direction.Left &&
        DirectionHelper.isFoodLeft(coordinates, grid)
      ) {
        foodDirections.push(Direction.Left);
      }
    }

    if (foodDirections.length === 0) {
      return Direction.Right;
    }

    return foodDirections[Math.floor(Math.random() * foodDirections.length)];
  };

  static isFoodDown = (
    coordinates: ICoordinates,
    grid: ICellDescriptor[][]
  ): boolean => {
    return (
      grid
        .slice(coordinates.y, grid.length)
        .map((array: ICellDescriptor[]) => array[coordinates.x])
        .filter((c: ICellDescriptor) => c.type === CellType.Food).length > 0
    );
  };

  static isFoodUp = (
    coordinates: ICoordinates,
    grid: ICellDescriptor[][]
  ): boolean => {
    return (
      grid
        .slice(0, coordinates.y)
        .map((array: ICellDescriptor[]) => array[coordinates.x])
        .filter((c: ICellDescriptor) => c.type === CellType.Food).length > 0
    );
  };

  static isFoodRight = (
    coordinates: ICoordinates,
    grid: ICellDescriptor[][]
  ): boolean => {
    return (
      grid[coordinates.y]
        .slice(coordinates.x, grid[coordinates.y].length)
        .filter((c: ICellDescriptor) => c.type === CellType.Food).length > 0
    );
  };

  static isFoodLeft = (
    coordinates: ICoordinates,
    grid: ICellDescriptor[][]
  ): boolean => {
    return (
      grid[coordinates.y]
        .slice(0, coordinates.x)
        .filter((c: ICellDescriptor) => c.type === CellType.Food).length > 0
    );
  };

  static getNextCoordinates = (
    currentCoordinates: ICoordinates,
    direction: Direction,
    grid: ICellDescriptor[][]
  ): ICoordinates => {
    if (direction === Direction.Right) {
      return {
        x:
          currentCoordinates.x + 1 < grid[currentCoordinates.y].length
            ? currentCoordinates.x + 1
            : 0,
        y: currentCoordinates.y,
      };
    } else if (direction === Direction.Down) {
      return {
        x: currentCoordinates.x,
        y:
          currentCoordinates.y + 1 > grid.length - 1
            ? 0
            : currentCoordinates.y + 1,
      };
    } else if (direction === Direction.Left) {
      return {
        x:
          currentCoordinates.x - 1 < 0
            ? grid[currentCoordinates.y].length - 1
            : currentCoordinates.x - 1,
        y: currentCoordinates.y,
      };
    } else if (direction === Direction.Up) {
      return {
        x: currentCoordinates.x,
        y:
          currentCoordinates.y - 1 < 0
            ? grid.length - 1
            : currentCoordinates.y - 1,
      };
    } else if (direction === Direction.None) {
      return currentCoordinates;
    }

    return currentCoordinates;
  };
}
