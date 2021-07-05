import './App.css';
import { useEffect, useState } from 'react';
import cloneDeep from 'lodash.clonedeep';
import { useEvent, addNumber, getColors, checkGameOver } from './util';
import { swipeDown, swipeLeft, swipeRight, swipeUp } from './movements';

function App() {

  const UP_ARROW = 38;
  const DOWN_ARROW = 40;
  const LEFT_ARROW = 37;
  const RIGHT_ARROW = 39;

	const [data, setData] = useState([
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	]);

  const [gameOver, setGameOver] = useState(false);

  // initialize
  const initialize = () => {
    let newGrid = cloneDeep(data);
    console.log(newGrid);

    addNumber(newGrid);
    console.table(newGrid);
    addNumber(newGrid);
    console.table(newGrid);
    setData(newGrid);
  }
  

  // Reset
  const resetGame = () => {
    const initialGrid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    addNumber(initialGrid);
    addNumber(initialGrid);
    setData(initialGrid);
    setGameOver(false);
  }
  
  // HANDLE KEY DOWN
  const handleKeyDown = (event) => {
    if (gameOver) {
      return;
    }

    switch (event.keyCode) {
      case UP_ARROW:
        swipeUp(data, setData);
        break;

      case DOWN_ARROW:
        swipeDown(data, setData);
        break;

      case LEFT_ARROW:
        swipeLeft(data, setData);
        break;

      case RIGHT_ARROW:
        swipeRight(data, setData);
        break;

      default:
        break;
    }

    let gameOverr = checkGameOver(data, setData);
    if (gameOverr) {
      alert("Game over");
      setGameOver(true);
    }
  }


  useEffect(() => {
    initialize();
  }, []);

  useEvent('keydown', handleKeyDown);


	return (
    <>
      <div
        style={style.main}
      >
        {data.map((row, index) => {
          return (
            <div style={{ display: 'flex' }} key={index}>
              {row.map((digit, i) => (
                <Block number={digit} key={i} />
              ))}
            </div>
          );
        })}
      </div>
      {gameOver && <div>GAME OVER</div>}
      <div
        onClick={resetGame}
        style={style.button}
      >
        New Game
      </div>
    </>
	);
}

const Block = ({number}) => {
  const blockStyle = style.block;
	return (
    <div
      style={{
        ...blockStyle,
        background: getColors(number),
        color: number === 2 || number === 4 ? "#605B53" : "white",
      }}
    >
      {number !== 0 ? number : ""}
    </div>
  );
}

const style = {
  main: {
    background: "#AD9D8F",
    width: "max-content",
    margin: "auto",
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  block: {
    height: 80,
    width: 80,
    background: "lightgray",
    margin: 3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 45,
    fontWeight: 500,
    color: "white",
  },
  button: {
    background: "#AD9D8F",
    width: "max-content",
    margin: "auto",
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
}

export default App;
