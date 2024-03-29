import cloneDeep from 'lodash.clonedeep';
import { addNumber, handleHighScore } from './util';

export const swipeLeft = (data, setData, score, setScore, setHighScore, dummy) => {
  let oldGrid = data;
  let newArray = cloneDeep(data);

  console.table(newArray);
  for (let i = 0; i < 4; i++) {
    let b = newArray[i];
    let slow = 0;
    let fast = 1;
    while (slow < 4) {
      if (fast === 4) {
        fast = slow + 1;
        slow++;
        continue;
      }
      if (b[slow] === 0 && b[fast] === 0) {
        fast++;
      } else if (b[slow] === 0 && b[fast] !== 0) {
        b[slow] = b[fast];
        b[fast] = 0;
        fast++;
      } else if (b[slow] !== 0 && b[fast] === 0) {
        fast++;
      } else if (b[slow] !== 0 && b[fast] !== 0) {
        if (b[slow] === b[fast]) {
          b[slow] = b[slow] + b[fast];
          score = score + b[slow];
          b[fast] = 0;
          fast = slow + 1;
          slow++;
        } else {
          slow++;
          fast = slow + 1;
        }
      }
    }
  }
  if (JSON.stringify(oldGrid) !== JSON.stringify(newArray)) {
    addNumber(newArray);
  }

  if (dummy) {
    return newArray;
  } else {
    setData(newArray);
    setScore(score);
    handleHighScore(score, setHighScore);
  }
}

export const swipeRight = (data, setData, score, setScore, setHighScore, dummy) => {
  let oldData = data;
  let newArray = cloneDeep(data);

  for (let i = 3; i >= 0; i--) {
    let b = newArray[i];
    let slow = b.length - 1;
    let fast = slow - 1;
    while (slow > 0) {
      if (fast === -1) {
        fast = slow - 1;
        slow--;
        continue;
      }
      if (b[slow] === 0 && b[fast] === 0) {
        fast--;
      } else if (b[slow] === 0 && b[fast] !== 0) {
        b[slow] = b[fast];
        b[fast] = 0;
        fast--;
      } else if (b[slow] !== 0 && b[fast] === 0) {
        fast--;
      } else if (b[slow] !== 0 && b[fast] !== 0) {
        if (b[slow] === b[fast]) {
          b[slow] = b[slow] + b[fast];
          score = score + b[slow];
          b[fast] = 0;
          fast = slow - 1;
          slow--;
        } else {
          slow--;
          fast = slow - 1;
        }
      }
    }
  }
  if (JSON.stringify(oldData) !== JSON.stringify(newArray)) {
    addNumber(newArray);
  }

  if (dummy) {
    return newArray;
  } else {
    setData(newArray);
    setScore(score);
    handleHighScore(score, setHighScore);
  }
}

export const swipeUp = (data, setData, score, setScore, setHighScore, dummy) => {
  let b = [...data];
  let oldData = JSON.parse(JSON.stringify(data));
  for (let i = 0; i < 4; i++) {
    let slow = 0;
    let fast = 1;
    while (slow < 4) {
      if (fast === 4) {
        fast = slow + 1;
        slow++;
        continue;
      }
      if (b[slow][i] === 0 && b[fast][i] === 0) {
        fast++;
      } else if (b[slow][i] === 0 && b[fast][i] !== 0) {
        b[slow][i] = b[fast][i];
        b[fast][i] = 0;
        fast++;
      } else if (b[slow][i] !== 0 && b[fast][i] === 0) {
        fast++;
      } else if (b[slow][i] !== 0 && b[fast][i] !== 0) {
        if (b[slow][i] === b[fast][i]) {
          b[slow][i] = b[slow][i] + b[fast][i];
          score = score + b[slow][i];
          b[fast][i] = 0;
          fast = slow + 1;
          slow++;
        } else {
          slow++;
          fast = slow + 1;
        }
      }
    }
  }
  if (JSON.stringify(oldData) !== JSON.stringify(b)) {
    addNumber(b);
  }

  if (dummy) {
    return b;
  } else {
    setData(b);
    setScore(score);
    handleHighScore(score, setHighScore);
  }
}

export const swipeDown = (data, setData, score, setScore, setHighScore, dummy) => {
  console.log(data);
  let b = [...data];
  let oldData = JSON.parse(JSON.stringify(data));
  for (let i = 3; i >= 0; i--) {
    let slow = b.length - 1;
    let fast = slow - 1;
    while (slow > 0) {
      if (fast === -1) {
        fast = slow - 1;
        slow--;
        continue;
      }
      if (b[slow][i] === 0 && b[fast][i] === 0) {
        fast--;
      } else if (b[slow][i] === 0 && b[fast][i] !== 0) {
        b[slow][i] = b[fast][i];
        b[fast][i] = 0;
        fast--;
      } else if (b[slow][i] !== 0 && b[fast][i] === 0) {
        fast--;
      } else if (b[slow][i] !== 0 && b[fast][i] !== 0) {
        if (b[slow][i] === b[fast][i]) {
          b[slow][i] = b[slow][i] + b[fast][i];
          score = score + b[slow][i];
          b[fast][i] = 0;
          fast = slow - 1;
          slow--;
        } else {
          slow--;
          fast = slow - 1;
        }
      }
    }
  }

  if (JSON.stringify(oldData) !== JSON.stringify(b)) {
    addNumber(b);
  }

  if (dummy) {
    return b;
  } else {
    setData(b);
    setScore(score);
    handleHighScore(score, setHighScore);
  }
}