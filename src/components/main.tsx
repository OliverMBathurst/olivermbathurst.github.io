import React, { useEffect, useState } from "react";
import Grid from "./grid";
import Overlay from "./overlay";
import HeadingContainer from "./headingContainer";
import Footer from "./footer";
import SourceCodeLink from "./sourceCodeLink";
import ISnakeCell from "../interfaces/snakeCell";
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
import { directionMappings } from "./constants";

const Main = () => {
  const [grid, setGrid] = useState<ISnakeCell[][] | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [
    snakeHeadCoordinates,
    setSnakeHeadCoordinates,
  ] = useState<ICoordinates>({ x: 0, y: 0 });

  useEffect(() => {
    initializeGrid();

    window.addEventListener("resize", onWindowResized);
    const intervalId = setInterval(run, Interval);

    setLoading(false);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    snakeCellArray[headY][headX].type = CellType.Snake;
    snakeCellArray[headY][headX].direction =
      directionMappings[Math.floor(Math.random() * (4 - 1) + 1)];

    for (var c = 1; c < InitialSnakeLength; c++) {
      snakeCellArray[headY][headX - c].direction = Direction.Fixed;
      snakeCellArray[headY][headX - c].type = CellType.Snake;
    }

    if (snakeCellArray[headY][headX].direction === Direction.Left) {
      snakeCellArray[headY][headX].direction = Direction.Fixed;
      snakeCellArray[headY][headX - InitialSnakeLength + 1].direction =
        Direction.Left;
    }

    setSnakeHeadCoordinates({ x: headX, y: headY });
    setGrid(snakeCellArray);
  };

  const onWindowResized = () => {};

  const run = () => {
    if (grid) {
      var originalCoordinates: ICoordinates = {
        x: snakeHeadCoordinates.x,
        y: snakeHeadCoordinates.y,
      };
      var direction =
        grid[snakeHeadCoordinates.x][snakeHeadCoordinates.y].direction;
      var newCoordinates = getNextCoordinates(originalCoordinates, direction);

      //todo

    }
  };

  const getNextCoordinates = (
    currentCoordinates: ICoordinates,
    direction: Direction
  ): ICoordinates | undefined => {
    if (direction == Direction.Right) {
      return { x: currentCoordinates.x + 1, y: currentCoordinates.y };
    } else if (direction == Direction.Down) {
      return { x: currentCoordinates.x, y: currentCoordinates.y - 1 };
    } else if (direction == Direction.Left) {
      return { x: currentCoordinates.x - 1, y: currentCoordinates.y };
    } else if (direction == Direction.Up) {
      return { x: currentCoordinates.x, y: currentCoordinates.y + 1 };
    } else if (direction == Direction.Fixed) {
      return currentCoordinates;
    }
    return undefined;
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
