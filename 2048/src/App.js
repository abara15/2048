import './App.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import {
  DIRECTIONS,
  addRandomTile,
  canMove,
  createInitialTiles,
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

// How long the CSS slide transition takes (src/App.css must match this).
const SLIDE_DURATION_MS = 120;
// Minimum distance (px) a touch has to travel before it counts as a swipe.
const SWIPE_THRESHOLD = 24;

function App() {
  const [tiles, setTiles] = useState(createInitialTiles);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(readHighScore);
  const [status, setStatus] = useState('playing'); // 'playing' | 'won' | 'over'
  const [keepPlaying, setKeepPlaying] = useState(false);

  // A ref mirror of state so the keydown/touch listeners always read the
  // latest values without needing to be re-attached on every render, and a
  // flag so a new move can't be started mid-slide (which would scramble the
  // in-flight animation).
  const stateRef = useRef();
  stateRef.current = { tiles, score, status, keepPlaying, isAnimating: false };
  const isAnimatingRef = useRef(false);
  const pendingTimeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(pendingTimeoutRef.current), []);

  const applyMove = useCallback((direction) => {
    const { tiles: currentTiles, score: currentScore, status: currentStatus, keepPlaying: currentKeepPlaying } = stateRef.current;

    if (isAnimatingRef.current) {
      return;
    }
    if (currentStatus === 'over' || (currentStatus === 'won' && !currentKeepPlaying)) {
      return;
    }

    const { slidTiles, settledTiles, scoreGained, moved } = move(currentTiles, direction);
    if (!moved) {
      return;
    }

    // Phase 1: move existing tiles to their landing spot. Tiles that are
    // about to merge land on top of each other here — the CSS transition on
    // each tile's position is what produces the slide.
    isAnimatingRef.current = true;
    setTiles(slidTiles);

    const nextScore = currentScore + scoreGained;
    setScore(nextScore);
    setHighScore((prevHigh) => {
      if (nextScore > prevHigh) {
        writeHighScore(nextScore);
        return nextScore;
      }
      return prevHigh;
    });

    // Phase 2: once the slide finishes, collapse merged pairs into their
    // combined tile and drop in a new random tile.
    pendingTimeoutRef.current = setTimeout(() => {
      const finalTiles = addRandomTile(settledTiles);
      setTiles(finalTiles);
      isAnimatingRef.current = false;

      if (hasWon(finalTiles) && !currentKeepPlaying) {
        setStatus('won');
      } else if (!canMove(finalTiles)) {
        setStatus('over');
      } else {
        setStatus('playing');
      }
    }, SLIDE_DURATION_MS);
  }, []);

  const startNewGame = useCallback(() => {
    clearTimeout(pendingTimeoutRef.current);
    isAnimatingRef.current = false;
    setTiles(createInitialTiles());
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

  // Block the browser's own scroll/pull-to-refresh gesture as soon as a
  // swipe starts on the board, so playing on a phone doesn't drag the page.
  const handleTouchMove = (event) => {
    if (touchStartRef.current) {
      event.preventDefault();
    }
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
          onTouchMove={handleTouchMove}
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

          <div className="board__cells">
            {Array.from({ length: 16 }).map((_, index) => (
              <div className="board__cell" key={index} />
            ))}
          </div>

          <div className="board__tiles">
            {tiles.map((tile) => (
              <Tile key={tile.id} tile={tile} />
            ))}
          </div>
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

const Tile = ({ tile }) => {
  const { background, color } = getTileColors(tile.value);
  const className = ['tile', tile.mergedFrom ? 'tile--merged' : '', tile.isNew ? 'tile--new' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={className}
      style={{
        '--row': tile.row,
        '--col': tile.col,
      }}
    >
      <div className="tile__inner" style={{ background, color }}>
        {tile.value}
      </div>
    </div>
  );
};

export default App;
