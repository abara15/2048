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
  let attempts = 0;
  while (!added) {
    if (gridFull) {
      break;
    }
    
    // Find two random numbers for grid indexes (0-3)
    let rand1 = Math.floor(Math.random() * 4);
    let rand2 = Math.floor(Math.random() * 4);
    // Increment attempts
    attempts++;
    if (newGrid[rand1][rand2] === 0) {
      newGrid[rand1][rand2] = Math.random() > 0.5 ? 2 : 4;
      added = true;
    }
  }
}

export const getColors = (number) => {
  switch (number) {
    case 2:
      return "#EBDCD0";
    case 4:
      return "#E9DBBA";
    case 8:
      return "#E9A067";
    case 16:
      return "#F08151";
    case 32:
      return "#F2654F";
    case 64:
      return "#F1462C";
    case 128:
      return "#E7C65E";
    case 256:
      return "#E8C350";
    case 512:
      return "#E8BE40";
    case 1024:
      return "#E8BB31";
    case 2048:
      return "#E7B723";
    default:
      return "#C2B3A3";
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