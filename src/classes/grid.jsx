import React from 'react';
import Cell from './cell'

class Grid extends React.Component {

    render() {
      var rows = this.props.grid.map((_, i) => this.props.grid[i].map((_, j) => {
          let boxId = i + "_" + j;
  
          return <Cell
                  cellClass = {this.props.grid[i][j] ? "cell on" : "cell off"}
                  key = {boxId}
                  boxId = {boxId}
                  row = {i}
                  column = {j}
                  selectCell = {this.props.selectCell}
                />
        })
      )
  
      return (
        <div className = "grid" style={{width: this.props.columnCount * 16}}>
          {rows}
        </div>
      )
    }
  }

  export default Grid