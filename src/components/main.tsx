import React, { useEffect, useState } from "react";
import Grid from "./grid";
import Overlay from "./overlay";
import HeadingContainer from "./headingContainer";
import Footer from "./footer";
import SourceCodeLink from "./sourceCodeLink";
import ISnakeCell from "../interfaces/snakeCell";
import ISnake from "../interfaces/snake";
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

const Main = () => {
  const [grid, setGrid] = useState<ISnakeCell[][] | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [snake, setSnake] = useState<ISnake | undefined>();
  const [timeout, setTimeout] = useState<NodeJS.Timeout>();
  const [userControlling, setUserControlling] = useState<boolean>(false);

  useEffect(() => {
    initializeGrid();

    window.addEventListener("resize", onWindowResized);
    window.addEventListener("keydown", onKeyDown);

    document.addEventListener("keyup", (e) => {
      if (e.code === "ArrowUp") {
      } else if (e.code === "ArrowDown") {
      }
    });

    setTimeout(setInterval(run, Interval));

    setLoading(false);
    return () => {
      if (timeout) {
        clearInterval(timeout);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onKeyDown = (event: any) => {
    if (snake) {
      if (event.keyCode in validKeyCodes) {
        var copy = { ...snake };
        if (event.keyCode == 39) {
          copy.direction = Direction.Right;
        } else if (event.keyCode == 37) {
          copy.direction = Direction.Left;
        }
        if (event.keyCode == 40) {
          copy.direction = Direction.Down;
        } else if (event.keyCode == 38) {
          copy.direction = Direction.Up;
        }

        setSnake(copy);
      }
    }
  };

  const restart = () => {
    if (timeout) {
      clearInterval(timeout);
    }
    initializeGrid();
    setTimeout(setInterval(run, Interval));
  };

  const initializeGrid = (
    width: number = Math.round(window.innerHeight / DefaultBoxHeight),
    height: number = Math.round(window.innerWidth / DefaultBoxWidth)
  ) => {
    var snakeCellArray: ISnakeCell[][] = [];

    for (var i = 0; i < height; i++) {
      snakeCellArray[i] = [];
      for (var j = 0; j < width; j++) {
        snakeCellArray[i][j] = {
          type: Math.random() > FoodChance ? CellType.Food : CellType.Normal,
          direction: Direction.Fixed,
        };
      }
    }

    var headX = Math.floor(
      Math.random() * (width - 2 * InitialSnakeLength) + InitialSnakeLength
    );
    var headY = Math.floor(
      Math.random() * (snakeCellArray.length - 2 * InitialSnakeLength) +
        InitialSnakeLength
    );

    var snake: ISnake = {
      cells: [{ x: headX, y: headY }],
      direction: Direction.Right,
    };

    for (var c = 1; c < InitialSnakeLength; c++) {
      snake.cells = snake.cells.concat({ x: headX - c, y: headY });
    }

    setSnake(snake);
    setGrid(snakeCellArray);
  };

  const onWindowResized = () => {
    if (grid) {
    }
  };

  const run = () => {
    if (grid && snake) {
      var nextDirection = userControlling
        ? snake.direction
        : getNextDirection(snake.cells[0], snake.direction);

      var newSnakeHeadCoordinates = getNextCoordinates(
        snake.cells[0],
        nextDirection
      );

      var snakeCopy: ISnake = {
        cells: getNewSnakeCells(snake.cells),
        direction: nextDirection,
      };

      if (
        grid[newSnakeHeadCoordinates.y][newSnakeHeadCoordinates.x].type ===
        CellType.Snake
      ) {
        restart();
      }

      setSnake(snakeCopy);
    }
  };

  const getNewSnakeCells = (cells: ICoordinates[]): ICoordinates[] => {
    var copy: ICoordinates[] = [...cells];
    for (var i = copy.length - 2; i >= 0; i--) {
      copy[i] = copy[i + 1];
    }
    return copy;
  };

  const getNextDirection = (
    coordinates: ICoordinates,
    direction: Direction
  ): Direction => {
    if (grid) {
      var foundFood: boolean = false;

      switch (direction) {
        case Direction.Down:
          foundFood = isFoodDown(coordinates);
          break;
        case Direction.Left:
          foundFood = isFoodLeft(coordinates);
          break;
        case Direction.Right:
          foundFood = isFoodRight(coordinates);
          break;
        case Direction.Up:
          foundFood = isFoodUp(coordinates);
          break;
      }

      if (!foundFood) {
        return getRandomNextDirection(coordinates, direction);
      }
    }

    return Direction.Up;
  };

  const getRandomNextDirection = (
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
      if (dir === Direction.Down && isFoodDown(coordinates)) {
        foodDirections.push(Direction.Down);
      } else if (dir === Direction.Up && isFoodUp(coordinates)) {
        foodDirections.push(Direction.Up);
      } else if (dir === Direction.Right && isFoodRight(coordinates)) {
        foodDirections.push(Direction.Right);
      } else if (dir === Direction.Left && isFoodLeft(coordinates)) {
        foodDirections.push(Direction.Left);
      }
    }

    if (foodDirections.length === 0) {
      return Direction.Right;
    }

    return foodDirections[Math.floor(Math.random() * foodDirections.length)];
  };

  const isFoodDown = (coordinates: ICoordinates): boolean => {
    if (!grid) {
      return false;
    }
    return (
      grid
        .slice(coordinates.y, grid.length)
        .filter((c) => c[0].type === CellType.Food).length > 0 &&
      grid[coordinates.y - 1][coordinates.x].type !== CellType.Snake
    );
  };

  const isFoodUp = (coordinates: ICoordinates): boolean => {
    if (!grid) {
      return false;
    }
    return (
      grid.slice(0, coordinates.y).filter((c) => c[0].type === CellType.Food)
        .length > 0 &&
      grid[coordinates.y + 1][coordinates.x].type !== CellType.Snake
    );
  };

  const isFoodRight = (coordinates: ICoordinates): boolean => {
    if (!grid) {
      return false;
    }
    return (
      grid[coordinates.y]
        .slice(coordinates.x, grid[coordinates.y].length)
        .filter((c) => c.type === CellType.Food).length > 0 &&
      grid[coordinates.y][coordinates.x + 1].type !== CellType.Snake
    );
  };

  const isFoodLeft = (coordinates: ICoordinates): boolean => {
    if (!grid) {
      return false;
    }
    return (
      grid[coordinates.y]
        .slice(coordinates.x, 0)
        .filter((c) => c.type === CellType.Food).length > 0 &&
      grid[coordinates.y][coordinates.x - 1].type !== CellType.Snake
    );
  };

  const getNextCoordinates = (
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

  if (loading) {
    return <></>;
  }

  return (
    <div>
      <HeadingContainer />
      <Overlay />
      <Grid
        grid={grid}
        rowCount={DefaultRowCount}
        columnCount={DefaultColumnCount}
      />
      <Footer />
      <SourceCodeLink />
    </div>
  );
};

export default Main;
