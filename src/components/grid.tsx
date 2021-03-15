import React from "react";
import IGridProps from "../interfaces/gridProps";
import ISnakeCell from "../interfaces/snakeCell";
import Cell from "./cell";
import { cellStyles } from "./constants";

const Grid = (props: IGridProps) => {
  const { grid } = props;

  if (!grid) {
    return <></>;
  }

  return (
    <div className="grid">
      {grid.map((_: ISnakeCell[], i: number) =>
        grid[i].map((_: ISnakeCell, j: number) => {
          let cellKey = i + "_" + j;

          return (
            <Cell
              key={cellKey}
              cellClass={cellStyles[grid[i][j].type]}
              cellKey={cellKey}
            />
          );
        })
      )}
    </div>
  );
};

export default Grid;
