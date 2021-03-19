import React from "react";
import IGridProps from "../interfaces/gridProps";
import ICellDescriptor from "../interfaces/cellDescriptor";
import Cell from "./cell";

const Grid = (props: IGridProps) => {
  const { grid } = props;

  if (!grid) {
    return <></>;
  }

  return (
    <div className="grid">
      {grid.map((_: ICellDescriptor[], i: number) =>
        grid[i].map((cell: ICellDescriptor, j: number) => {
          let cellKey = i + "_" + j;

          return (
            <Cell
              key={cellKey}
              cellClass={cell.cellClass}
              cellKey={cellKey}
              cellStyle={cell.style}
            />
          );
        })
      )}
    </div>
  );
};

export default Grid;
