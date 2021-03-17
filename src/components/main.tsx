import React, { useEffect, useState, Component } from "react";
import Grid from "./grid";
import Overlay from "./overlay";
import HeadingContainer from "./headingContainer";
import Footer from "./footer";
import SourceCodeLink from "./sourceCodeLink";
import ICell from "../interfaces/cell";
import ISnake from "../interfaces/snake";
import IState from '../interfaces/state';
import IProps from '../interfaces/props';
import ICoordinates from "../interfaces/coordinates";
import {
  DefaultRowCount,
  DefaultColumnCount,
  DefaultBoxHeight,
  DefaultBoxWidth,
  InitialSnakeLength,
  FoodChance,
  Interval,
} from "../constants/constants";
import { CellType } from "../enums/cellType";
import { Direction } from "../enums/direction";
import { validKeyCodes } from "./constants";

class Main extends Component<IProps, IState> {
  
  constructor(props: IProps) {
    super(props);

    window.addEventListener("resize", this.onWindowResized);
    window.addEventListener("keydown", this.onKeyDown);

    var width: number = Math.round(window.innerHeight / DefaultBoxHeight), height: number = Math.round(window.innerWidth / DefaultBoxWidth);
    this.state = {
      grid: this.getNewGrid(width, height),
      snake: this.getNewSnake(width, height),
      timeout: setInterval(this.run, Interval),
      userControlling: false
    };
  }

  getNewSnake = (gridWidth: number, gridHeight: number): ISnake => {
    var headX = Math.floor(
      Math.random() * (gridWidth - 2 * InitialSnakeLength) + InitialSnakeLength
    );
    var headY = Math.floor(
      Math.random() * (gridHeight - 2 * InitialSnakeLength) +
        InitialSnakeLength
    );

    var snake: ISnake = {
      cells: [{ x: headX, y: headY }],
      direction: Direction.Right,
    };

    for (var c = 1; c < InitialSnakeLength; c++) {
      snake.cells = snake.cells.concat({ x: headX - c, y: headY });
    }

    return snake;
  }

  getNewGrid = (width: number, height: number): ICell[][] => {
    return new Array<Array<ICell>>(
      height
    ).map(() => {
      return new Array<ICell>(width).map(() => {
        return {
          type: Math.random() > FoodChance ? CellType.Food : CellType.Normal,
        };
      });
    });
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (this.state.snake) {
      if (event.defaultPrevented) {
        return;
      }
      if (event.keyCode in validKeyCodes) {
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
          userControlling: true
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
      timeout: setInterval(this.run, Interval)
    });
  };

  onWindowResized = () => {
    if (this.state.grid) {

    }
  };

  run = (): void => {
    if (this.state.grid && this.state.snake) {
      var nextDirection = this.state.userControlling
        ? this.state.snake.direction
        : this.getNextDirection(this.state.snake.cells[0], this.state.snake.direction);

      var newSnakeHeadCoordinates = this.getNextCoordinates(
        this.state.snake.cells[0],
        nextDirection
      );

      this.state.snake.cells[0] = newSnakeHeadCoordinates;
      var snakeCopy: ISnake = {
        cells: this.getNewSnakeCells(this.state.snake.cells),
        direction: nextDirection,
      };

      if (
        this.state.grid[snakeCopy.cells[0].y][snakeCopy.cells[0].x].type === CellType.Snake
      ) {
        this.restart();
      } else if (
        this.state.grid[snakeCopy.cells[0].y][snakeCopy.cells[0].x].type === CellType.Food
      ) {
        //append cell to tail
      }

      for (var i = 0; i < snakeCopy.cells.length; i++) {
        this.state.grid[snakeCopy.cells[i].y][snakeCopy.cells[i].x].type = CellType.Snake;
      }

      this.setState({ snake: snakeCopy });
    }
  };

  getNewSnakeCells = (cells: ICoordinates[]): ICoordinates[] => {
    var copy: ICoordinates[] = [...cells];
    for (var i = copy.length - 2; i >= 0; i--) {
      copy[i] = copy[i + 1];
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
        .filter((c: ICell[]) => c[0].type === CellType.Food).length > 0 &&
        this.state.grid[coordinates.y - 1][coordinates.x].type !== CellType.Snake
    );
  };

  isFoodUp = (coordinates: ICoordinates): boolean => {
    if (!this.state.grid) {
      return false;
    }
    return (
      this.state.grid.slice(0, coordinates.y).filter((c: ICell[]) => c[0].type === CellType.Food)
        .length > 0
    );
  };

  isFoodRight = (coordinates: ICoordinates): boolean => {
    if (!this.state.grid) {
      return false;
    }
    return (
      this.state.grid[coordinates.y]
        .slice(coordinates.x, this.state.grid[coordinates.y].length)
        .filter((c: ICell) => c.type === CellType.Food).length > 0
    );
  };

  isFoodLeft = (coordinates: ICoordinates): boolean => {
    if (!this.state.grid) {
      return false;
    }
    return (
      this.state.grid[coordinates.y]
        .slice(coordinates.x, 0)
        .filter((c: ICell) => c.type === CellType.Food).length > 0
    );
  };

  getNextCoordinates = (
    currentCoordinates: ICoordinates,
    direction: Direction
  ): ICoordinates => {
    if (direction === Direction.Right) {
      return { x: currentCoordinates.x + 1, y: currentCoordinates.y };
    } else if (direction === Direction.Down) {
      return { x: currentCoordinates.x, y: currentCoordinates.y - 1 };
    } else if (direction === Direction.Left) {
      return { x: currentCoordinates.x - 1, y: currentCoordinates.y };
    } else if (direction === Direction.Up) {
      return { x: currentCoordinates.x, y: currentCoordinates.y + 1 };
    } else if (direction === Direction.Fixed) {
      return currentCoordinates;
    }
    return currentCoordinates;
  };

  render() {
    return (
      <>
      {this.state.grid &&
        (
          <div>
            <HeadingContainer />
            <Overlay />
            <Grid
              grid={this.state.grid}
              rowCount={DefaultRowCount}
              columnCount={DefaultColumnCount}
            />
            <Footer />
            <SourceCodeLink />
          </div>
        )
      }
      </>
    )
  }  
}

export default Main;
