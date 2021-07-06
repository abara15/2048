import './App.css';
import { useEffect, useState } from 'react';
import cloneDeep from 'lodash.clonedeep';
import GlitchText from 'react-glitch-effect/core/GlitchText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { useEvent, addNumber, getColors, checkGameOver } from './util';
import { swipeDown, swipeLeft, swipeRight, swipeUp } from './movements';
import background from "./img/3160.jpg"

function App() {

  // Key codes for arrows pressed
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
  const [score, setScore] = useState(0);
  

  // Reset
  const resetGame = () => {
    // Create a new grid filled with our initial 0s
    const initialGrid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    // Add either a 2 or a 4 to the grid, twice
    addNumber(initialGrid);
    addNumber(initialGrid);

    // Set our data as our new grid with the inserted numbers
    setData(initialGrid);

    // Our game isn't over anymore, so set gameOver to false
    setGameOver(false);
  }
  

  // Handle key presses
  const handleKeyDown = (event) => {
    // Doesn't allow key presses if our gameOver status is true
    if (gameOver) {
      return;
    }

    // Will swipe the grid up/down/left/right depending on key pressed
    switch (event.keyCode) {
      case UP_ARROW:
        swipeUp(data, setData, score, setScore);
        break;

      case DOWN_ARROW:
        swipeDown(data, setData, score, setScore);
        break;

      case LEFT_ARROW:
        swipeLeft(data, setData, score, setScore);
        break;

      case RIGHT_ARROW:
        swipeRight(data, setData, score, setScore);
        break;

      default:
        break;
    }

    // let highScore = localStorage.getItem("highscore");
    // if (highScore !== null) {
    //   if (score > highScore) {
    //     localStorage.setItem("highscore", score);
    //   }
    // } else {
    //   localStorage.setItem("highscore", score);
    // }

    // Check if game is over
    let gameStatus = checkGameOver(data, setData, score, setScore);
    if (gameStatus) {
      // Status is true, so give an alert, set gameOver status as true, and reset game
      alert("Game over");
      setGameOver(true);
      resetGame();
    }
  }


  // Initializes our starting board
  useEffect(() => {
    // Clones our const data set
    let newGrid = cloneDeep(data);
    console.log(newGrid);

    // Add either a 2 or a 4 to the grid, twice
    addNumber(newGrid);
    console.table(newGrid);
    addNumber(newGrid);
    console.table(newGrid);

    // Set our data as our new grid with the inserted numbers
    setData(newGrid);
  }, []);


  // Calls the handleKeyDown function whenever a keydown event occurs
  useEvent('keydown', handleKeyDown);


	return (
    <div style={style.body}>
      <GlitchText
        style={style.title}
        disabled={false} 
        color1='rgba(5, 217, 232, 1)'
        color2='rgba(255, 42, 109, 1)'
        iterationCount='infinite'
        onHover={false}
      >
        2048
      </GlitchText>

      <div style={style.flexContainer}>
        <div style={style.scoreContainer}>
          <div style={style.scoreItem}>
            <span>Score</span>
            <span style={style.score}>{score}</span>
          </div>
          <div style={style.scoreItem}>
            <span>Best</span>
            <span style={style.score}>{score}</span>
          </div>
        </div>
        <div style={style.main}>
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
        {gameOver}
        <div
          onClick={resetGame}
          style={style.button}
        >
          <FontAwesomeIcon icon={faRedo}  />
        </div>
      </div>
      <div style={style.footer}>
        <p
          style={{
            fontSize: 20,
            fontFamily: 'Monument'
          }}
        >
          Made by <a 
          href="https://abara15.github.io" 
          style={{
            color: "#05D9E8",
            textDecoration: 'none',
          }}
          >
            Anthony Barakat
          </a>
        </p>
        <a
          href="https://www.freepik.com/vectors/business"
          style={{
            fontSize: 12,
          }}
        >
          Business vector created by vectorpocket - www.freepik.com
        </a>
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
        // color: number === 2 || number === 4 ? "white" : "white",
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
    position: "fixed",
    padding: 0,
    margin: 0,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    userSelect: "none",
  },
  title: {
    fontFamily: 'Monument',
    fontSize: 150,
    color: 'white',
    padding: '30px 0px',
    textAlign: 'center',
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  scoreContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  scoreItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#05D9E8',
    fontFamily: 'Monument',
    fontSize: 12,
    color: '#111111',
    margin: 10,
    padding: '10px 50px',
    borderRadius: 5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  score: {
    fontFamily: 'Monument',
    fontSize: 30,
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
    height: "2.5em",
    width: "2.5em",
    background: "#321450",
    margin: 3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Monument",
    fontSize: 30,
    fontWeight: 500,
    color: "white",
  },
  button: {
    cursor: "pointer",
    backgroundColor: '#05D9E8',
    width: "max-content",
    fontSize: 30,
    margin: "auto",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonHover: {
    color: 'red,'
  },
  footer: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    left: 0,
    textAlign: 'center',
    color: 'white',
  },
}

export default App;
