import React from "react";
import ICellProps from "../interfaces/cellProps";

const Cell = (props: ICellProps) => {
  const { cellClass, cellKey, cellStyle } = props;

  return (
    <div className={`cell ${cellClass}`} key={cellKey} style={cellStyle} />
  );
};

export default Cell;
