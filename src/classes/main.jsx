import React from 'react';
import Grid from './grid'
import Footer from './footer'
import Overlay from './overlay'
import HeadingContainer from './heading_container'
import { clone, merge } from './global_functions'
import { DefaultRowCount, DefaultColumnCount, DefaultBoxHeight, DefaultBoxWidth, LifeChance, Interval } from '../constants/constants'

class Main extends React.Component {

    constructor() {
      super();
      window.addEventListener("resize", this.updateGridDimensions);
  
      this.state = {
        grid : Array(DefaultRowCount).fill().map(() => Array(DefaultColumnCount).fill(false)),
      }
    }

    componentDidMount = () => {
      let grid = this.seedGrid(this.state.grid);
      this.setState({grid: grid})   
      this.setupInterval()
    }

    setupInterval = () => {
      this.intervalId = setInterval(this.playSimulation, Interval)
    }

    cancelInterval = () => {
      clearInterval(this.intervalId);
    }

    playSimulation = () => {
      let grid = this.state.grid
      let copy = clone(this.state.grid)
      let change = false

      for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
          let life = 0

          //Adjacents
          if (i > 0 && grid[i-1][j]) life++;
          if (i + 1 < grid.length && grid[i+1][j]) life++;
          if (j >= 0 && grid[i][j-1]) life++;
          if (j + 1 < grid[i].length && grid[i][j+1]) life++;

          //Diagonals
          if (j - 1 >= 0 && i - 1 >= 0 && grid[i-1][j-1]) life++;
          if (j + 1 < grid[i].length && i - 1 >= 0 && grid[i-1][j+1]) life++; 
          if (i + 1 < grid.length && j + 1 < grid[i].length && grid[i+1][j+1]) life++;
          if (i + 1 < grid.length && j - 1 >= 0 && grid[i+1][j-1]) life++;

          if (grid[i][j] && (life < 2 || life > 3)) {
            copy[i][j] = false;
            change = true
          } else if (!grid[i][j] && life === 3) {
            copy[i][j] = true
            change = true
          }
        }
      }

      if (!change) {
        copy = this.seedGrid(copy)
      }
      
      this.setState({grid: copy})
    }

    seedGrid = (grid) => {
      let copy = clone(grid);
      for (var i = 0; i < copy.length; i++){
        for (var j = 0; j < copy[i].length; j++){
          copy[i][j] = Math.random() > LifeChance;
        }
      }
      return copy
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
          />
          <Footer/>
        </div>
      )
    }
  }

  export default Main