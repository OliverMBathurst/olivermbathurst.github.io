import { Direction } from "../enums/direction";
import { CellType } from "../enums/cellType";
import ICellDescriptor from "../interfaces/cellDescriptor";
import ICoordinates from "../interfaces/coordinates";
import IGrid from "../interfaces/grid";
import ISnake from "../interfaces/snake";
import SnakeHelper from "./snakeHelper";

export default class DirectionHelper {
  static nextSnakeValid = (
    snake: ISnake,
    direction: Direction,
    grid: IGrid
  ): boolean => {
    return SnakeHelper.validateSnake(
      SnakeHelper.getNextSnake(snake, direction, grid),
      grid
    );
  };

  static getNextDirection = (snake: ISnake, grid: IGrid): Direction => {
    var foundFood: boolean = false;
    var headCoordinates = snake.cells[0];

    switch (snake.direction) {
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

    return foundFood &&
      DirectionHelper.nextSnakeValid(snake, snake.direction, grid)
      ? snake.direction
      : DirectionHelper.getRandomNextDirection(snake, snake.direction, grid);
  };

  static getRandomNextDirection = (
    snake: ISnake,
    excludedDirection: Direction,
    grid: IGrid
  ): Direction => {
    var allDirections: Direction[] = [
      Direction.Down,
      Direction.Left,
      Direction.Right,
      Direction.Up,
    ];

    const head = snake.cells[0];

    allDirections.splice(allDirections.indexOf(excludedDirection), 1);

    var foodDirections: Direction[] = [];
    var validDirections: Direction[] = [];

    for (var dir of allDirections) {
      var foundFood: boolean = false;

      if (dir === Direction.Down && DirectionHelper.isFoodDown(head, grid)) {
        foundFood = true;
      } else if (dir === Direction.Up && DirectionHelper.isFoodUp(head, grid)) {
        foundFood = true;
      } else if (
        dir === Direction.Right &&
        DirectionHelper.isFoodRight(head, grid)
      ) {
        foundFood = true;
      } else if (
        dir === Direction.Left &&
        DirectionHelper.isFoodLeft(head, grid)
      ) {
        foundFood = true;
      }

      if (DirectionHelper.nextSnakeValid(snake, dir, grid)) {
        validDirections.push(dir);
      }

      if (foundFood) {
        foodDirections.push(dir);
      }
    }

    if (foodDirections.length > 0) {
      var goldDirections = foodDirections.filter(
        (foodDirection) => validDirections.indexOf(foodDirection) !== -1
      );
      if (goldDirections.length > 0) {
        return goldDirections[
          Math.floor(Math.random() * goldDirections.length)
        ];
      }
    }

    if (validDirections.length > 0) {
      return validDirections[
        Math.floor(Math.random() * validDirections.length)
      ];
    }

    return Direction.Right;
  };

  static isFoodDown = (coordinates: ICoordinates, grid: IGrid): boolean => {
    return (
      grid.cells
        .slice(coordinates.y, grid.cells.length)
        .map((array: ICellDescriptor[]) => array[coordinates.x])
        .filter((c: ICellDescriptor) => c.type === CellType.Food).length > 0
    );
  };

  static isFoodUp = (coordinates: ICoordinates, grid: IGrid): boolean => {
    return (
      grid.cells
        .slice(0, coordinates.y)
        .map((array: ICellDescriptor[]) => array[coordinates.x])
        .filter((c: ICellDescriptor) => c.type === CellType.Food).length > 0
    );
  };

  static isFoodRight = (coordinates: ICoordinates, grid: IGrid): boolean => {
    return (
      grid.cells[coordinates.y]
        .slice(coordinates.x, grid.cells[coordinates.y].length)
        .filter((c: ICellDescriptor) => c.type === CellType.Food).length > 0
    );
  };

  static isFoodLeft = (coordinates: ICoordinates, grid: IGrid): boolean => {
    return (
      grid.cells[coordinates.y]
        .slice(0, coordinates.x)
        .filter((c: ICellDescriptor) => c.type === CellType.Food).length > 0
    );
  };
}
