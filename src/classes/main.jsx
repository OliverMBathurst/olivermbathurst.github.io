import React from 'react';
import Grid from './grid'
import Footer from './footer'
import Overlay from './overlay'
import HeadingContainer from './heading_container'
import { clone, merge } from './global_functions'
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
          <HeadingContainer/>
          <Overlay/>
          <Grid 
            grid = {this.state.grid}
            rowCount = {DefaultRowCount}
            columnCount = {DefaultColumnCount}
            selectCell = {this.selectCell}
          />
          <Footer/>
        </div>
      )
    }
  }

  export default Main