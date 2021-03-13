import React, { useEffect, useState } from 'react';
import Grid from './grid'
import Footer from './footer'
import Overlay from './overlay'
import HeadingContainer from './headingContainer'
import { merge } from './constants'
import { DefaultRowCount, DefaultColumnCount, DefaultBoxHeight, DefaultBoxWidth, LifeChance, Interval } from '../constants/constants'

const Main = () => {
  const [grid, setGrid] = useState<boolean[][]>(Array(DefaultRowCount).fill(false).map(() => Array(DefaultColumnCount).fill(false)));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {

    setGrid(getNewGrid());

    window.addEventListener("resize", () => setGrid(merge(grid, getNewGrid())));

    const intervalId = setInterval(() => {
      let copy = [...grid]
      let change = false

      for (var i = 0; i < copy.length; i++) {
        for (var j = 0; j < copy[i].length; j++) {
          let life = 0

          //Adjacents
          if (i > 0 && copy[i-1][j]) life++;
          if (i + 1 < copy.length && copy[i+1][j]) life++;
          if (j >= 0 && copy[i][j-1]) life++;
          if (j + 1 < copy[i].length && copy[i][j+1]) life++;

          //Diagonals
          if (j - 1 >= 0 && i - 1 >= 0 && copy[i-1][j-1]) life++;
          if (j + 1 < copy[i].length && i - 1 >= 0 && copy[i-1][j+1]) life++; 
          if (i + 1 < copy.length && j + 1 < copy[i].length && grid[i+1][j+1]) life++;
          if (i + 1 < copy.length && j - 1 >= 0 && copy[i+1][j-1]) life++;

          if (copy[i][j] && (life < 2 || life > 3)) {
            copy[i][j] = false;
            change = true
          } else if (!copy[i][j] && life === 3) {
            copy[i][j] = true
            change = true
          }
        }
      }

      if (!change) {
        for (var ic = 0; ic < copy.length; ic++){
          for (var jc = 0; jc < copy[ic].length; jc++){
            copy[ic][jc] = Math.random() > LifeChance;
          }
        }
      }
    
    setGrid(copy);
    }, Interval);

    setLoading(false);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const getNewGrid = (width: number = Math.round(window.innerHeight/DefaultBoxHeight), height: number = Math.round(window.innerWidth/DefaultBoxWidth)) : boolean[][] => {
      var boolArray: boolean[][] = [];

      for (var i = 0; i < height; i++){
        boolArray[i] = new Array<boolean>(width).map(() => Math.random() > LifeChance);
      }

      return boolArray;
  }

  if (loading) {
    return <></>
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

export default Main