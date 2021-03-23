import React, { Component } from "react";
import Grid from "./grid";
import IState from "../interfaces/state";
import IProps from "../interfaces/props";
import IWindowParameters from "../interfaces/windowParameters";
import TextContainer from "./textContainer";
import SourceCodeLink from "./sourceCodeLink";
import SnakeHelper from "../helpers/snakeHelper";
import GridHelper from "../helpers/gridHelper";
import DirectionHelper from "../helpers/directionHelper";
import WindowHelper from "../helpers/windowHelper";
import {
  Interval,
  validKeyCodes,
  cellClasses,
  InitialSnakeLength,
} from "../constants";
import { CellType } from "../enums/cellType";
import { Direction } from "../enums/direction";
import IGridChange from "../interfaces/gridChange";

class Main extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    window.addEventListener("resize", this.onWindowResized);
    window.addEventListener("keydown", this.onKeyDown);

    const {
      width,
      height,
    }: IWindowParameters = WindowHelper.getNewWindowParams();

    var newGrid = GridHelper.getNewGrid(width, height);
    var newSnake = SnakeHelper.getNewSnake(newGrid);

    for (const cell of newSnake.cells) {
      newGrid.cells[cell.y][cell.x] = {
        type: CellType.Snake,
        cellClass: cellClasses[CellType.Snake],
      };
    }

    this.state = {
      grid: newGrid,
      snake: newSnake,
      timeout: setInterval(this.run, Interval),
      userControlling: false,
      paused: false,
      debug: false,
      windowResizeTimeout: null,
    };
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    if (validKeyCodes.indexOf(event.code) !== -1) {
      if (event.code === "KeyP" || event.code === "KeyR") {
        this.setState({
          paused: event.code === "KeyP",
        });
        return;
      }

      if (event.code === "KeyD") {
        this.setState({
          debug: true,
        });
        return;
      }

      var copy = { ...this.state.snake };
      if (event.code === "ArrowRight") {
        copy.direction = Direction.Right;
      } else if (event.code === "ArrowLeft") {
        copy.direction = Direction.Left;
      } else if (event.code === "ArrowDown") {
        copy.direction = Direction.Down;
      } else if (event.code === "ArrowUp") {
        copy.direction = Direction.Up;
      }

      this.setState({
        snake: copy,
        userControlling: true,
      });
    }
  };

  restart = () => {
    if (this.state.timeout) {
      clearInterval(this.state.timeout);
    }

    if (!this.state.paused) {
      this.setState({ paused: true });
    }

    var {
      width,
      height,
    }: IWindowParameters = WindowHelper.getNewWindowParams();

    var newGrid = GridHelper.getNewGrid(width, height);
    this.setState({
      grid: newGrid,
      snake: SnakeHelper.getNewSnake(newGrid),
      userControlling: false,
      timeout: setInterval(this.run, Interval),
      paused: false,
    });
  };

  onWindowResized = () => {
    this.setState({ paused: true });

    if (this.state.windowResizeTimeout) {
      clearTimeout(this.state.windowResizeTimeout);
    }

    this.setState({
      windowResizeTimeout: setTimeout(this.restart, 200),
    });
  };

  run = (): void => {
    if (this.state.paused) {
      return;
    }

    var snakeCopy = {
      direction: this.state.snake.direction,
      cells: [...this.state.snake.cells],
    };

    if (
      snakeCopy.cells.length ===
      InitialSnakeLength + this.state.grid.foodCount
    ) {
      this.restart();
      return;
    }

    var nextDirection = this.state.userControlling
      ? snakeCopy.direction
      : DirectionHelper.getNextDirection(snakeCopy, this.state.grid);

    var nextSnake = SnakeHelper.getNextSnake(
      snakeCopy,
      nextDirection,
      this.state.grid
    );

    if (!SnakeHelper.validateSnake(nextSnake, this.state.grid)) {
      this.restart();
      return;
    }

    if (
      this.state.grid.cells[nextSnake.cells[0].y][nextSnake.cells[0].x].type ===
      CellType.Food
    ) {
      nextSnake = SnakeHelper.addToTail(nextSnake, this.state.grid);
      if (!SnakeHelper.validateSnake(nextSnake, this.state.grid)) {
        this.restart();
        return;
      }
    }

    var changes: IGridChange[] = [];

    for (const cell of this.state.snake.cells) {
      if (
        nextSnake.cells.filter(
          (newCell) => newCell.x === cell.x && newCell.y === cell.y
        ).length === 0
      ) {
        changes.push({
          coordinates: { x: cell.x, y: cell.y },
          cell: {
            type: CellType.Normal,
            cellClass: cellClasses[CellType.Normal],
          },
        });
      }
    }

    for (const cell of nextSnake.cells) {
      if (this.state.grid.cells[cell.y][cell.x].type !== CellType.Snake) {
        changes.push({
          coordinates: { x: cell.x, y: cell.y },
          cell: {
            type: CellType.Snake,
            cellClass: cellClasses[CellType.Snake],
          },
        });
      }
    }

    if (changes.length > 0) {
      var copy = { ...this.state.grid };
      for (var change of changes) {
        copy.cells[change.coordinates.y][change.coordinates.x] = change.cell;
      }
      this.setState({
        grid: copy,
        snake: nextSnake,
      });
      return;
    }

    this.setState({
      snake: nextSnake,
    });
  };

  render() {
    return (
      <>
        <div>
          {!this.state.userControlling && <TextContainer />}
          <Grid grid={this.state.grid} />
          <SourceCodeLink />
        </div>
      </>
    );
  }
}

export default Main;
