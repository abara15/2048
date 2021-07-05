import { useEffect } from "react"
import { swipeDown, swipeLeft, swipeRight, swipeUp } from "./movements";

export const useEvent = (event, handler, passive = false) => {
    useEffect(() => {
        // initiate the event handler
        window.addEventListener(event, handler, passive);

        // this will cleanup the event every time the component unmounts
        return function cleanup () {
            window.removeEventListener(event, handler);
        }
    })
}

// AddNumber - add an item
export const addNumber = (newGrid) => {
  let added = false;
  let gridFull = false;
  while (!added) {
    if (gridFull) {
      break;
    }
    
    // Find two random numbers for grid indexes (0-3)
    let rand1 = Math.floor(Math.random() * 4);
    let rand2 = Math.floor(Math.random() * 4);
    // Increment attempts
    if (newGrid[rand1][rand2] === 0) {
      newGrid[rand1][rand2] = Math.random() > 0.5 ? 2 : 4;
      added = true;
    }
  }
}

export const getColors = (number) => {
  switch (number) {
    case 2:
      return "#FF2A6D";
    case 4:
      return "#520091";
    case 8:
      return "#1afe49";
    case 16:
      return "#03304e";
    case 32:
      return "#fd7d74";
    case 64:
      return "#e1408b";
    case 128:
      return "#0016EE";
    case 256:
      return "#2a0040";
    case 512:
      return "#d8c51a";
    case 1024:
      return "#f2025b";
    case 2048:
      return "#7400e6";
    default:
      return "#150103";
  }
}

// Check GameOver
export const checkGameOver = (data, setData) => {
  let checkLeft = swipeLeft(data, setData, true);
  if (JSON.stringify(data) !== JSON.stringify(checkLeft)) {
    return false;
  }

  let checkRight = swipeRight(data, setData, true);
  if (JSON.stringify(data) !== JSON.stringify(checkRight)) {
    return false;
  }

  let checkUp = swipeUp(data, setData, true);
  if (JSON.stringify(data) !== JSON.stringify(checkUp)) {
    return false;
  }

  let checkDown = swipeDown(data, setData, true);
  if (JSON.stringify(data) !== JSON.stringify(checkDown)) {
    return false;
  }

  return true;
}