import { InitialSnakeLength } from "../constants";
import { Direction } from "../enums/direction";
import ICoordinates from "../interfaces/coordinates";
import IGrid from "../interfaces/grid";
import ISnake from "../interfaces/snake";
import DirectionHelper from "./directionHelper";

export default class SnakeHelper {
  static getNewSnake = (grid: IGrid): ISnake => {
    var headX = Math.floor(
      Math.random() * (grid.width - 2 * InitialSnakeLength) + InitialSnakeLength
    );
    var headY = Math.floor(
      Math.random() * (grid.height - 2 * InitialSnakeLength) +
        InitialSnakeLength
    );

    var snake: ISnake = {
      cells: [{ x: headX, y: headY }],
      direction: Direction.Right,
    };

    for (var c = 1; c < InitialSnakeLength; c++) {
      snake.cells = snake.cells.concat({ x: headX - c, y: headY });
    }

    var allDirections: Direction[] = [
      Direction.Left,
      Direction.Right,
      Direction.Down,
      Direction.Up,
    ];
    var validDirections: Direction[] = [];

    for (const dir of allDirections) {
      if (DirectionHelper.nextSnakeValid(snake, dir, grid)) {
        validDirections.push(dir);
      }
    }

    if (validDirections.length !== 0) {
      snake.direction =
        validDirections[Math.floor(Math.random() * validDirections.length)];
    }

    return snake;
  };

  static validateSnake = (snake: ISnake, grid: IGrid): boolean => {
    for (let i = 0; i < snake.cells.length; i++) {
      const cell = snake.cells[i];

      if (
        snake.cells.filter(
          (snakeCell) => snakeCell.x === cell.x && snakeCell.y === cell.y
        ).length > 1
      ) {
        return false;
      }

      if (cell.y < 0 || cell.y > grid.cells.length - 1) {
        return false;
      }

      if (cell.x < 0 || cell.x > grid.cells[cell.y].length - 1) {
        return false;
      }
    }

    return true;
  };

  static addToTail = (snake: ISnake, grid: IGrid): ISnake => {
    var snakeCopy: ISnake = {
      direction: snake.direction,
      cells: [...snake.cells],
    };
    var tail = snakeCopy.cells[snakeCopy.cells.length - 1];
    var penultimate = snakeCopy.cells[snakeCopy.cells.length - 2];

    if (tail.x > penultimate.x) {
      snakeCopy.cells = snakeCopy.cells.concat({
        x: tail.x + 1 > grid.cells[tail.y].length - 1 ? 0 : tail.x + 1,
        y: tail.y,
      });
    } else if (penultimate.x > tail.x) {
      snakeCopy.cells = snakeCopy.cells.concat({
        x: tail.x - 1 < 0 ? grid.cells[tail.y].length - 1 : tail.x - 1,
        y: tail.y,
      });
    } else {
      if (penultimate.y < tail.y) {
        snakeCopy.cells = snakeCopy.cells.concat({
          x: tail.x,
          y: tail.y + 1 > grid.cells.length - 1 ? 0 : tail.y + 1,
        });
      } else {
        snakeCopy.cells = snakeCopy.cells.concat({
          x: tail.x,
          y: tail.y - 1 < 0 ? grid.cells.length - 1 : tail.y - 1,
        });
      }
    }

    return snakeCopy;
  };

  static getNextSnake = (
    snake: ISnake,
    direction: Direction,
    grid: IGrid
  ): ISnake => {
    var snakeCopy: ISnake = {
      direction: snake.direction,
      cells: [...snake.cells],
    };
    var head = snakeCopy.cells[0];
    var nextHead: ICoordinates;

    if (direction === Direction.Right) {
      nextHead = {
        x: head.x + 1 < grid.cells[head.y].length ? head.x + 1 : 0,
        y: head.y,
      };
    } else if (direction === Direction.Down) {
      nextHead = {
        x: head.x,
        y: head.y + 1 > grid.cells.length - 1 ? 0 : head.y + 1,
      };
    } else if (direction === Direction.Left) {
      nextHead = {
        x: head.x - 1 < 0 ? grid.cells[head.y].length - 1 : head.x - 1,
        y: head.y,
      };
    } else if (direction === Direction.Up) {
      nextHead = {
        x: head.x,
        y: head.y - 1 < 0 ? grid.cells.length - 1 : head.y - 1,
      };
    } else {
      nextHead = { ...head };
    }

    for (var i = snakeCopy.cells.length - 1; i > 0; i--) {
      snakeCopy.cells[i] = snakeCopy.cells[i - 1];
    }

    snakeCopy.cells[0] = nextHead;
    snakeCopy.direction = direction;

    return snakeCopy;
  };
}
