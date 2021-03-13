import React from 'react';
import ICellProps from '../interfaces/cellProps';

const Cell = (props: ICellProps) => {
  const { cellClass, cellKey } = props;
  
    return (
      <div
        className = {cellClass}
        key = {cellKey}
      />
    )
}

export default Cell