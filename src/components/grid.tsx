import React from 'react';
import IGridProps from '../interfaces/gridProps';
import Cell from './cell'

const Grid = (props: IGridProps) => {
  const { grid } = props;

  return (
    <div className = "grid">
      {grid.map((_: boolean[], i: number) => grid[i].map((_: boolean, j: number) => {
        let cellKey = i + "_" + j;

        return <Cell
            cellClass = {grid[i][j] ? "cell on" : "cell off"}
            key = {cellKey}
          />
      }))}
    </div>
  )
}

  export default Grid;