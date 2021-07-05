import './App.css';
import { useEffect, useState } from 'react';
import cloneDeep from 'lodash.clonedeep';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faRedo } from '@fortawesome/free-solid-svg-icons';
import { useEvent, addNumber, getColors, checkGameOver } from './util';
import { swipeDown, swipeLeft, swipeRight, swipeUp } from './movements';
import background from "./img/3160.jpg"

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

    let gameStatus = checkGameOver(data, setData);
    if (gameStatus) {
      alert("Game over");
      setGameOver(true);
      resetGame();
    }
  }


  useEffect(() => {
    initialize();
  }, []);

  useEvent('keydown', handleKeyDown);


	return (
    <div
      style={style.body}
    >
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
        <FontAwesomeIcon icon={faRedo} />
        <span>New Game</span>
        <FontAwesomeIcon icon={faGamepad} />
      </div>
    </div>
	);
}

const Block = ({number}) => {
  const blockStyle = style.block;
	return (
    <div
      style={{
        ...blockStyle,
        background: getColors(number),
        color: number === 2 || number === 4 ? "white" : "white",
      }}
    >
      {number !== 0 ? number : ""}
    </div>
  );
}

const style = {
  body: {
    backgroundImage: `url(${background})`,
    backgroundPosition: "center center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    backgroundColor: "#111111",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    padding: 0,
    margin: 0,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    userSelect: "none",
  },
  main: {
    background: "#05D9E8",
    width: "max-content",
    margin: "auto",
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  block: {
    height: 100,
    width: 100,
    background: "#321450",
    margin: 3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 50,
    fontWeight: 500,
    color: "white",
  },
  button: {
    cursor: "pointer",
    background: "#AD9D8F",
    width: "max-content",
    margin: "auto",
    padding: 5,
    borderRadius: 5,
    border: "1px solid #FFFFFF",
    marginTop: 10,
    // display: "flex",
    // flexDirection: "row",
    // justifyContent: "space-between",
  },
}

export default App;
