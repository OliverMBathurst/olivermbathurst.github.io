import React from 'react';

class Cell extends React.Component {

  render() {
    return (
      <div 
        className = {this.props.cellClass}
        id = {this.props.id}
      />
    )
  }
}

export default Cell