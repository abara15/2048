import './App.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import {
  DIRECTIONS,
  addRandomTile,
  canMove,
  createInitialGrid,
  getTileColors,
  hasWon,
  move,
  readHighScore,
  writeHighScore,
} from './gameLogic';

const KEY_TO_DIRECTION = {
  ArrowUp: DIRECTIONS.UP,
  ArrowDown: DIRECTIONS.DOWN,
  ArrowLeft: DIRECTIONS.LEFT,
  ArrowRight: DIRECTIONS.RIGHT,
  w: DIRECTIONS.UP,
  s: DIRECTIONS.DOWN,
  a: DIRECTIONS.LEFT,
  d: DIRECTIONS.RIGHT,
};

// Minimum distance (px) a touch has to travel before it counts as a swipe.
const SWIPE_THRESHOLD = 30;

function App() {
  const [grid, setGrid] = useState(createInitialGrid);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(readHighScore);
  const [status, setStatus] = useState('playing'); // 'playing' | 'won' | 'over'
  const [keepPlaying, setKeepPlaying] = useState(false);

  // A ref mirror of state so the keydown/touch listeners can always read the
  // latest values without needing to be torn down and re-attached on every
  // render (and without going stale, which was the source of the old
  // "game over fires on the wrong board" bug).
  const stateRef = useRef();
  stateRef.current = { grid, score, status, keepPlaying };

  const applyMove = useCallback((direction) => {
    const { grid: currentGrid, score: currentScore, status: currentStatus, keepPlaying: currentKeepPlaying } = stateRef.current;

    if (currentStatus === 'over' || (currentStatus === 'won' && !currentKeepPlaying)) {
      return;
    }

    const { grid: slidGrid, gained, moved } = move(currentGrid, direction);
    if (!moved) {
      return;
    }

    const nextGrid = addRandomTile(slidGrid);
    const nextScore = currentScore + gained;

    setGrid(nextGrid);
    setScore(nextScore);
    setHighScore((prevHigh) => {
      if (nextScore > prevHigh) {
        writeHighScore(nextScore);
        return nextScore;
      }
      return prevHigh;
    });

    if (hasWon(nextGrid) && !currentKeepPlaying) {
      setStatus('won');
    } else if (!canMove(nextGrid)) {
      setStatus('over');
    } else {
      setStatus('playing');
    }
  }, []);

  const startNewGame = useCallback(() => {
    setGrid(createInitialGrid());
    setScore(0);
    setStatus('playing');
    setKeepPlaying(false);
  }, []);

  // Keyboard controls.
  useEffect(() => {
    const handleKeyDown = (event) => {
      const direction = KEY_TO_DIRECTION[event.key];
      if (!direction) {
        return;
      }
      event.preventDefault();
      applyMove(direction);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [applyMove]);

  // Touch / swipe controls for mobile.
  const touchStartRef = useRef(null);

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event) => {
    if (!touchStartRef.current) {
      return;
    }
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < SWIPE_THRESHOLD) {
      return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      applyMove(deltaX > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT);
    } else {
      applyMove(deltaY > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP);
    }
  };

  const isOverlayVisible = status === 'over' || (status === 'won' && !keepPlaying);

  return (
    <div className="app">
      <div className="app__container">
        <header className="header">
          <h1 className="title">2048</h1>
          <div className="scoreboard">
            <div className="score-box">
              <span className="score-box__label">Score</span>
              <span className="score-box__value">{score}</span>
            </div>
            <div className="score-box">
              <span className="score-box__label">Best</span>
              <span className="score-box__value">{highScore}</span>
            </div>
          </div>
        </header>

        <div className="toolbar">
          <p className="instructions">Join the tiles, get to <strong>2048!</strong></p>
          <button type="button" className="new-game-button" onClick={startNewGame}>
            <FontAwesomeIcon icon={faRedo} />
            New Game
          </button>
        </div>

        <div
          className="board"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {isOverlayVisible && (
            <div className="board-overlay">
              <p className="board-overlay__message">
                {status === 'won' ? 'You win!' : 'Game over'}
              </p>
              <div className="board-overlay__actions">
                {status === 'won' && (
                  <button
                    type="button"
                    className="board-overlay__button board-overlay__button--secondary"
                    onClick={() => setKeepPlaying(true)}
                  >
                    Keep going
                  </button>
                )}
                <button
                  type="button"
                  className="board-overlay__button"
                  onClick={startNewGame}
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {grid.map((row, rowIndex) => (
            <div className="board__row" key={rowIndex}>
              {row.map((value, colIndex) => (
                <Tile value={value} key={colIndex} />
              ))}
            </div>
          ))}
        </div>

        <footer className="footer">
          <p>
            Made by{' '}
            <a href="https://abara15.github.io" className="footer__link">
              Anthony Barakat
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

const Tile = ({ value }) => {
  const { background, color } = getTileColors(value);
  return (
    <div className="tile" style={{ background: value ? background : undefined, color }}>
      {value !== 0 ? value : ''}
    </div>
  );
};

export default App;
