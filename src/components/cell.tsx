import React from 'react';
import ICellProps from '../interfaces/cellProps';

const Cell = (props: ICellProps) => {
  const { cellClass, key } = props;
  
    return (
      <div
        className = {cellClass}
        key = {key}
      />
    )
}

export default Cell