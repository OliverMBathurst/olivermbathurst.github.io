import React, { Component } from "react";
import Grid from "./grid";
import ISnake from "../interfaces/snake";
import IState from "../interfaces/state";
import IProps from "../interfaces/props";
import ICoordinates from "../interfaces/coordinates";
import IWindowParameters from "../interfaces/windowParameters";
import TextContainer from "./textContainer";
import SourceCodeLink from "./sourceCodeLink";
import SnakeHelper from "../helpers/snakeHelper";
import GridHelper from "../helpers/gridHelper";
import DirectionHelper from "../helpers/directionHelper";
import WindowHelper from "../helpers/windowHelper";
import { Interval, validKeyCodes, cellClasses } from "../constants";
import { CellType } from "../enums/cellType";
import { Direction } from "../enums/direction";

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
    var newSnake = SnakeHelper.getNewSnake(width, height);

    for (var i = 0; i < newSnake.cells.length; i++) {
      newGrid[newSnake.cells[i].y][newSnake.cells[i].x] = {
        type: CellType.Snake,
        cellClass: cellClasses[CellType.Snake],
        style: {},
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
    if (!this.state.snake || !this.state.grid || event.defaultPrevented) {
      return;
    }

    if (validKeyCodes.indexOf(event.keyCode) !== -1) {
      if (event.keyCode === 80 || event.keyCode === 82) {
        this.setState({
          paused: event.keyCode === 80,
        });
        return;
      }

      if (event.keyCode === 68) {
        this.setState({
          debug: true,
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

    this.setState({
      grid: GridHelper.getNewGrid(width, height),
      snake: SnakeHelper.getNewSnake(width, height),
      userControlling: false      
    });

    this.setState({
      timeout: setInterval(this.run, Interval),
      paused: false
    })
  };

  onWindowResized = () => {
    if (this.state.grid) {
      this.setState({ paused: true });

      if (this.state.windowResizeTimeout) {
        clearTimeout(this.state.windowResizeTimeout);
      }
      this.setState({
        windowResizeTimeout: setTimeout(this.restart, 200),
      });
    }
  };

  run = (): void => {
    if (this.state.paused) {
      return;
    }

    if (this.state.grid && this.state.snake) {
      var nextDirection = this.state.userControlling
        ? this.state.snake.direction
        : DirectionHelper.getNextDirection(
            this.state.snake.cells[0],
            this.state.snake.direction,
            this.state.grid
          );

      var newSnakeHeadCoordinates = DirectionHelper.getNextCoordinates(
        this.state.snake.cells[0],
        nextDirection,
        this.state.grid
      );

      var snakeCopy: ISnake = {
        cells: SnakeHelper.getNewSnakeCells(
          [...this.state.snake.cells],
          newSnakeHeadCoordinates
        ),
        direction: nextDirection,
      };

      if (!SnakeHelper.validateSnake(snakeCopy, this.state.grid)) {
        this.restart();
      }

      var gridCopy = [...this.state.grid];
      if (
        gridCopy[snakeCopy.cells[0].y][snakeCopy.cells[0].x].type ===
        CellType.Food
      ) {
        snakeCopy = SnakeHelper.addToTail(snakeCopy, this.state.grid);
        if (!SnakeHelper.validateSnake(snakeCopy, this.state.grid)) {
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
          cellClass: cellClasses[CellType.Normal],
        };
      }

      var newCells = snakeCopy.cells.filter(
        (newCell: ICoordinates) =>
          gridCopy[newCell.y][newCell.x].type !== CellType.Snake
      );
      for (var i = 0; i < newCells.length; i++) {
        gridCopy[newCells[i].y][newCells[i].x] = {
          type: CellType.Snake,
          cellClass: cellClasses[CellType.Snake],
          style: {},
        };
      }

      if (this.state.debug) {
        gridCopy[0][0].cellClass = cellClasses[CellType.Debug];
        gridCopy[gridCopy.length - 1][0].cellClass =
          cellClasses[CellType.Debug];
        gridCopy[0][gridCopy[0].length - 1].cellClass =
          cellClasses[CellType.Debug];
        gridCopy[gridCopy.length - 1][
          gridCopy[gridCopy.length - 1].length - 1
        ].cellClass = cellClasses[CellType.Debug];
      }

      this.setState({
        snake: snakeCopy,
        grid: gridCopy,
      });
    }
  };

  render() {
    return (
      <>
        {this.state.grid && (
          <div>
            {!this.state.userControlling && <TextContainer />}            
            <Grid grid={this.state.grid} />
            <SourceCodeLink />
          </div>
        )}
      </>
    );
  }
}

export default Main;
