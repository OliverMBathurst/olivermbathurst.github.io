import React from 'react';
import Grid from './grid'
import Footer from './footer'
import Canvas from './canvas'
import { clone, merge } from './global'
import { DefaultRowCount, DefaultColumnCount, DefaultBoxHeight, DefaultBoxWidth } from '../constants/constants'

class Main extends React.Component {

    constructor() {
      super();
      window.addEventListener("resize", this.updateGridDimensions);
  
      this.state = {
        grid : Array(DefaultRowCount).fill().map(() => Array(DefaultColumnCount).fill(false)),
      }
    }
  
    selectCell = (row, column) => {
      let copy = clone(this.state.grid)
      copy[row][column] = !copy[row][column]
      this.setState({
        grid: copy
      })
    }
  
    updateGridDimensions = () => {
      const resized = Array(parseInt(window.innerHeight/DefaultBoxHeight)).fill().map(() => Array(parseInt(window.innerWidth/DefaultBoxWidth)).fill(false))
      const merged = merge(this.state.grid, resized)
  
      this.setState({grid: merged})
    }
  
    render() {
      return (
        <div>
          <Canvas/>
          <Grid 
            grid = {this.state.grid}
            rowCount = {this.rowCount}
            columnCount = {this.columnCount}
            selectCell = {this.selectCell}
          />
          <Footer/>
        </div>
      )
    }
  }

  export default Main