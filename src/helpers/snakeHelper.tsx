import { InitialSnakeLength } from "../constants";
import { Direction } from "../enums/direction";
import ICellDescriptor from "../interfaces/cellDescriptor";
import ICoordinates from "../interfaces/coordinates";
import ISnake from "../interfaces/snake";

export default class SnakeHelper {
  static getNewSnake = (gridWidth: number, gridHeight: number): ISnake => {
    var headX = Math.floor(
      Math.random() * (gridWidth - 2 * InitialSnakeLength) + InitialSnakeLength
    );
    var headY = Math.floor(
      Math.random() * (gridHeight - 2 * InitialSnakeLength) + InitialSnakeLength
    );

    var snake: ISnake = {
      cells: [{ x: headX, y: headY }],
      direction: Direction.Right,
    };

    for (var c = 1; c < InitialSnakeLength; c++) {
      snake.cells = snake.cells.concat({ x: headX - c, y: headY });
    }

    return snake;
  };

  static validateSnake = (
    snake: ISnake,
    grid: ICellDescriptor[][]
  ): boolean => {
    for (let i = 0; i < snake.cells.length; i++) {
      const cell = snake.cells[i];

      if (snake.cells.filter((snakeCell) => snakeCell.x === cell.x && snakeCell.y === cell.y).length > 1) {
        return false;
      }

      if (cell.y < 0 || cell.y > grid.length - 1) {
        return false;
      }

      if (cell.x < 0 || cell.x > grid[cell.y].length - 1) {
        return false;
      }
    }

    return true;
  };

  static addToTail = (snake: ISnake, grid: ICellDescriptor[][]): ISnake => {
    var tail = snake.cells[snake.cells.length - 1];
    var penultimate = snake.cells[snake.cells.length - 2];

    if (tail.x > penultimate.x) {
      snake.cells = snake.cells.concat({
        x: tail.x + 1 > grid[tail.y].length - 1 ? 0 : tail.x + 1,
        y: tail.y,
      });
    } else if (penultimate.x > tail.x) {
      snake.cells = snake.cells.concat({
        x: tail.x - 1 < 0 ? grid[tail.y].length - 1 : tail.x - 1,
        y: tail.y,
      });
    } else {
      if (penultimate.y < tail.y) {
        snake.cells.concat({
          x: tail.x,
          y: tail.y + 1 > grid.length - 1 ? 0 : tail.y + 1,
        });
      } else {
        snake.cells.concat({
          x: tail.x,
          y: tail.y - 1 < 0 ? grid.length - 1 : tail.y - 1,
        });
      }
    }

    return snake;
  };

  static getNewSnakeCells = (cells: ICoordinates[], newHeadCoordinates: ICoordinates): ICoordinates[] => {
    var copy: ICoordinates[] = [...cells];
    for (var i = copy.length - 1; i > 0; i--) {
      copy[i] = copy[i - 1];
    }

    copy[0] = newHeadCoordinates;
    return copy;
  };
}
