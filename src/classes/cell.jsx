import React from 'react';

class Cell extends React.Component {

  selectCell = () => {
    this.props.selectCell(this.props.row, this.props.column)
  }

  render() {
    return (
      <div 
        className = {this.props.cellClass}
        id = {this.props.id}
        onClick = {this.selectCell}
      />
    )
  }
}

export default Cell