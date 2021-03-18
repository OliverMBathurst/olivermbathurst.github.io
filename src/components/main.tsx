import React, { Component } from "react";
import Grid from "./grid";
import Overlay from "./overlay";
import HeadingContainer from "./headingContainer";
import Footer from "./footer";
import SourceCodeLink from "./sourceCodeLink";
import ICellDescriptor from "../interfaces/cell";
import ISnake from "../interfaces/snake";
import IState from "../interfaces/state";
import IProps from "../interfaces/props";
import ICoordinates from "../interfaces/coordinates";
import {
  DefaultBoxHeight,
  DefaultBoxWidth,
  InitialSnakeLength,
  FoodChance,
  Interval,
  validKeyCodes,
  cellStyles,
} from "./constants";
import { CellType } from "../enums/cellType";
import { Direction } from "../enums/direction";

class Main extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    window.addEventListener("resize", this.onWindowResized);
    window.addEventListener("keydown", this.onKeyDown);

    var width: number = Math.round(window.innerHeight / DefaultBoxHeight),
      height: number = Math.round(window.innerWidth / DefaultBoxWidth);

    var newGrid = this.getNewGrid(width, height);
    var newSnake = this.getNewSnake(width, height);

    for (var i = 0; i < newSnake.cells.length; i++) {
      newGrid[newSnake.cells[i].y][newSnake.cells[i].x] = {
        type: CellType.Snake,
        cellClass: cellStyles[CellType.Snake],
        style: {}
      };
    }

    this.state = {
      grid: newGrid,
      snake: newSnake,
      timeout: setInterval(this.run, Interval),
      userControlling: false,
      paused: false
    };
  }

  getNewSnake = (gridWidth: number, gridHeight: number): ISnake => {
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

  getNewGrid = (width: number, height: number): ICellDescriptor[][] => {
    var newGrid: ICellDescriptor[][] = [];
    for (var i = 0; i < height; i++) {
      newGrid[i] = [];
      for (var j = 0; j < width; j++) {
        var cellType = Math.random() > FoodChance ? CellType.Food : CellType.Normal;
        var style = cellType === CellType.Food ? { opacity: Math.random() > 0.5 ? 1 : 0.5 } : {};

        newGrid[i][j] = {
          type: cellType,
          cellClass: cellStyles[cellType],
          style: style,
        };
      }
    }
    return newGrid;
  };

  onKeyDown = (event: KeyboardEvent) => {
    if (this.state.snake) {
      if (event.defaultPrevented) {
        return;
      }
      if (validKeyCodes.indexOf(event.keyCode) !== -1) {
        if (event.keyCode === 80 || event.keyCode === 82){
          this.setState({
            paused: event.keyCode === 80
          });
          return;
        }

        var copy = { ...this.state.snake };
        if (event.keyCode === 39) {
          copy.direction = Direction.Right;
        } else if (event.keyCode === 37) {
          copy.direction = Direction.Left;
        } else if (event.keyCode === 40) {
          copy.direction = Direction.Down;
        } else if (event.keyCode === 38) {
          copy.direction = Direction.Up;
        }

        this.setState({
          snake: copy,
          userControlling: true,
        });
      }
    }
  };

  restart = () => {
    if (this.state.timeout) {
      clearInterval(this.state.timeout);
    }

    this.setState({
      userControlling: false,
      timeout: setInterval(this.run, Interval),
    });
  };

  onWindowResized = () => {
    if (this.state.grid) {
    }
  };

  run = (): void => {
    if (this.state.paused) {
      return;
    }

    if (this.state.grid && this.state.snake) {
      var nextDirection = this.state.userControlling
        ? this.state.snake.direction
        : this.getNextDirection(
            this.state.snake.cells[0],
            this.state.snake.direction
          );

      var newSnakeHeadCoordinates = this.getNextCoordinates(
        this.state.snake.cells[0],
        nextDirection
      );

      var snakeCopy: ISnake = {
        cells: this.getNewSnakeCells([...this.state.snake.cells]),
        direction: nextDirection,
      };

      snakeCopy.cells[0] = newSnakeHeadCoordinates;

      if (!this.validateSnake(snakeCopy)) {
        this.restart();
      }

      var gridCopy = [...this.state.grid];
      if (
        gridCopy[snakeCopy.cells[0].y][snakeCopy.cells[0].x].type ===
        CellType.Food
      ) {
        snakeCopy = this.addToTail(snakeCopy);
        if (!this.validateSnake(snakeCopy)) {
          this.restart();
        }
      }

      var oldCells = this.state.snake.cells.filter(
        (oldSnakeCell) => snakeCopy.cells.indexOf(oldSnakeCell) === -1
      );
      for (var oldC = 0; oldC < oldCells.length; oldC++) {
        gridCopy[oldCells[oldC].y][oldCells[oldC].x] = {
          type: CellType.Normal,
          style: {},
          cellClass: cellStyles[CellType.Normal]
        };
      }

      var newCells = snakeCopy.cells.filter(
        (newCell: ICoordinates) =>
          gridCopy[newCell.y][newCell.x].type !== CellType.Snake
      );
      for (var i = 0; i < newCells.length; i++) {
        gridCopy[newCells[i].y][newCells[i].x] = {
          type: CellType.Snake,
          cellClass: cellStyles[CellType.Snake],
          style: {}
        };
      }

      this.setState({
        snake: snakeCopy,
        grid: gridCopy,
      });
    }
  };

  addToTail = (snake: ISnake): ISnake => {
    var tail = snake.cells[snake.cells.length - 1];
    var penultimate = snake.cells[snake.cells.length - 2];
    if (tail.x > penultimate.x) {
      snake.cells = snake.cells.concat({ x: tail.x + 1, y: tail.y });
    } else if (penultimate.x > tail.x) {
      snake.cells = snake.cells.concat({ x: tail.x - 1, y: tail.y });
    } else {
      if (penultimate.y < tail.y) {
        snake.cells.concat({ x: tail.x, y: tail.y + 1 });
      } else {
        snake.cells.concat({ x: tail.x, y: tail.y - 1 });
      }
    }

    return snake;
  };

  validateSnake = (snake: ISnake): boolean => {
    for (var i = 0; i < snake.cells.length; i++) {
      var cell = snake.cells[i];
      if (snake.cells.filter((x) => x === cell).length > 1) {
        return false;
      }

      if (cell.y < 0 || cell.y > this.state.grid.length - 1) {
        return false;
      }

      if (cell.x < 0 || cell.x > this.state.grid[cell.y].length - 1) {
        return false;
      }
    }

    return true;
  };

  getNewSnakeCells = (cells: ICoordinates[]): ICoordinates[] => {
    var copy: ICoordinates[] = [...cells];
    for (var i = copy.length - 1; i > 0; i--) {
      copy[i] = copy[i - 1];
    }
    return copy;
  };

  getNextDirection = (
    headCoordinates: ICoordinates,
    direction: Direction
  ): Direction => {
    if (this.state.grid) {
      var foundFood: boolean = false;

      switch (direction) {
        case Direction.Down:
          foundFood = this.isFoodDown(headCoordinates);
          break;
        case Direction.Left:
          foundFood = this.isFoodLeft(headCoordinates);
          break;
        case Direction.Right:
          foundFood = this.isFoodRight(headCoordinates);
          break;
        case Direction.Up:
          foundFood = this.isFoodUp(headCoordinates);
          break;
      }

      if (!foundFood) {
        return this.getRandomNextDirection(headCoordinates, direction);
      } else {
        return direction;
      }
    }

    return Direction.Up;
  };

  getRandomNextDirection = (
    coordinates: ICoordinates,
    excludedDirection: Direction
  ): Direction => {
    var allDirections: Direction[] = [
      Direction.Down,
      Direction.Left,
      Direction.Right,
      Direction.Up,
    ];

    allDirections = allDirections.splice(
      allDirections.indexOf(excludedDirection),
      1
    );

    var foodDirections: Direction[] = [];

    for (var dir of allDirections) {
      if (dir === Direction.Down && this.isFoodDown(coordinates)) {
        foodDirections.push(Direction.Down);
      } else if (dir === Direction.Up && this.isFoodUp(coordinates)) {
        foodDirections.push(Direction.Up);
      } else if (dir === Direction.Right && this.isFoodRight(coordinates)) {
        foodDirections.push(Direction.Right);
      } else if (dir === Direction.Left && this.isFoodLeft(coordinates)) {
        foodDirections.push(Direction.Left);
      }
    }

    if (foodDirections.length === 0) {
      return Direction.Right;
    }

    return foodDirections[Math.floor(Math.random() * foodDirections.length)];
  };

  isFoodDown = (coordinates: ICoordinates): boolean => {
    if (!this.state.grid) {
      return false;
    }
    return (
      this.state.grid
        .slice(coordinates.y, this.state.grid.length)
        .filter((c: ICellDescriptor[]) => c[0].type === CellType.Food).length >
        0 &&
      this.state.grid[coordinates.y - 1][coordinates.x].type !== CellType.Snake
    );
  };

  isFoodUp = (coordinates: ICoordinates): boolean => {
    if (!this.state.grid) {
      return false;
    }
    return (
      this.state.grid
        .slice(0, coordinates.y)
        .filter((c: ICellDescriptor[]) => c[0].type === CellType.Food).length >
      0
    );
  };

  isFoodRight = (coordinates: ICoordinates): boolean => {
    if (!this.state.grid) {
      return false;
    }
    return (
      this.state.grid[coordinates.y]
        .slice(coordinates.x, this.state.grid[coordinates.y].length)
        .filter((c: ICellDescriptor) => c.type === CellType.Food).length > 0
    );
  };

  isFoodLeft = (coordinates: ICoordinates): boolean => {
    if (!this.state.grid) {
      return false;
    }
    return (
      this.state.grid[coordinates.y]
        .slice(coordinates.x, 0)
        .filter((c: ICellDescriptor) => c.type === CellType.Food).length > 0
    );
  };

  getNextCoordinates = (
    currentCoordinates: ICoordinates,
    direction: Direction
  ): ICoordinates => {
    if (direction === Direction.Right) {
      return {
        x:
          currentCoordinates.x + 1 <
          this.state.grid[currentCoordinates.y].length - 1
            ? currentCoordinates.x + 1
            : 0,
        y: currentCoordinates.y,
      };
    } else if (direction === Direction.Down) {
      return {
        x: currentCoordinates.x,
        y:
          currentCoordinates.y + 1 > this.state.grid.length - 1
            ? 0
            : currentCoordinates.y + 1,
      };
    } else if (direction === Direction.Left) {
      return {
        x:
          currentCoordinates.x - 1 < 0
            ? this.state.grid[currentCoordinates.y].length - 1
            : currentCoordinates.x - 1,
        y: currentCoordinates.y,
      };
    } else if (direction === Direction.Up) {
      return {
        x: currentCoordinates.x,
        y:
          currentCoordinates.y - 1 < 0
            ? this.state.grid.length - 1
            : currentCoordinates.y - 1,
      };
    } else if (direction === Direction.Fixed) {
      return currentCoordinates;
    }
    return currentCoordinates;
  };

  render() {
    return (
      <>
        {this.state.grid && (
          <div>
            <HeadingContainer />
            <Overlay />
            <Grid grid={this.state.grid} />
            <Footer />
            <SourceCodeLink />
          </div>
        )}
      </>
    );
  }
}

export default Main;
