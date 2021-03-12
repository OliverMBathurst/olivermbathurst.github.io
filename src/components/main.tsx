import React, { useState } from 'react';
import Grid from './grid'
import Footer from './footer'
import Overlay from './overlay'
import HeadingContainer from './headingContainer'
import { clone, merge } from './constants'
import { DefaultRowCount, DefaultColumnCount, DefaultBoxHeight, DefaultBoxWidth, LifeChance, Interval } from '../constants/constants'

const Main = () => {
  const [grid, setGrid] = useState<boolean[][]>();

    useState(() => {
      window.addEventListener("resize", updateGridDimensions);   
      
      var seededGrid: Array<Array<boolean>> = Array(DefaultRowCount)
        .map(() => Math.random() > LifeChance)
        .map(() => Array(DefaultColumnCount).map(() => Math.random() > LifeChance));
      
      setGrid(seededGrid);
      setInterval(playSimulation, Interval);
    })

    const playSimulation = () => {
      let gridCopy = grid;
      let copy = clone(gridCopy);
      let change = false;

      for (var i = 0; i < gridCopy.length; i++) {
        for (var j = 0; j < gridCopy[i].length; j++) {
          let life = 0;

          //Adjacents
          if (i > 0 && gridCopy[i-1][j]) life++;
          if (i + 1 < gridCopy.length && gridCopy[i+1][j]) life++;
          if (j >= 0 && gridCopy[i][j-1]) life++;
          if (j + 1 < gridCopy[i].length && gridCopy[i][j+1]) life++;

          //Diagonals
          if (j - 1 >= 0 && i - 1 >= 0 && gridCopy[i-1][j-1]) life++;
          if (j + 1 < gridCopy[i].length && i - 1 >= 0 && gridCopy[i-1][j+1]) life++; 
          if (i + 1 < gridCopy.length && j + 1 < gridCopy[i].length && gridCopy[i+1][j+1]) life++;
          if (i + 1 < gridCopy.length && j - 1 >= 0 && gridCopy[i+1][j-1]) life++;

          if (gridCopy[i][j] && (life < 2 || life > 3)) {
            copy[i][j] = false;
            change = true;
          } else if (!gridCopy[i][j] && life === 3) {
            copy[i][j] = true;
            change = true;
          }
        }
      }

      if (!change) {
        copy = seedGrid(copy);
      }
      
      setGrid(copy);
    }

    const seedGrid = (grid: boolean[][]): boolean[][] => {
      let copy = clone(grid);
      for (var i = 0; i < copy.length; i++) {
        for (var j = 0; j < copy[i].length; j++) {
          copy[i][j] = Math.random() > LifeChance;
        }
      }
      return copy;
    }  
  
    const updateGridDimensions = () => {
      const resized = Array(window.innerHeight/DefaultBoxHeight).fill(false)
        .map(() => Array(window.innerWidth/DefaultBoxWidth).fill(false));

      const merged = merge(grid, resized);
  
      setGrid(merged);
    }
  
    return (
      <div>
        <HeadingContainer/>
        <Overlay/>
        <Grid 
          grid = {grid}
          rowCount = {DefaultRowCount}
          columnCount = {DefaultColumnCount}
        />
        <Footer/>
      </div>
    )
  }

  export default Main;