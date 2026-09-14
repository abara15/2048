// Core 2048 game logic.
//
// Every function here is pure: it takes a grid (and maybe a direction) and
// returns a *new* grid/result rather than mutating its arguments. Keeping
// this layer side-effect free makes the rules easy to test and makes the
// React layer (App.js) trivial to reason about, since a single move can be
// computed and applied in one synchronous step.

export const GRID_SIZE = 4;
export const WINNING_VALUE = 2048;
export const HIGH_SCORE_KEY = '2048-high-score';

export const DIRECTIONS = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

// Creates a fresh GRID_SIZE x GRID_SIZE grid filled with zeros.
export const createEmptyGrid = () =>
  Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));

// Returns a brand new grid with two starting tiles placed on it.
export const createInitialGrid = () => {
  let grid = createEmptyGrid();
  grid = addRandomTile(grid);
  grid = addRandomTile(grid);
  return grid;
};

const getEmptyCells = (grid) => {
  const cells = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) {
        cells.push([row, col]);
      }
    }
  }
  return cells;
};

// Returns a new grid with a single 2 (90%) or 4 (10%) tile placed in a
// random empty cell. If the grid is already full, the same grid is
// returned unchanged instead of looping forever looking for a free cell.
export const addRandomTile = (grid) => {
  const emptyCells = getEmptyCells(grid);
  if (emptyCells.length === 0) {
    return grid;
  }

  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const next = grid.map((r) => [...r]);
  next[row][col] = Math.random() < 0.9 ? 2 : 4;
  return next;
};

// Slides and merges a single row to the left, e.g. [2,2,4,0] -> [4,4,0,0].
// Returns the resulting row plus the score gained from any merges.
const slideRowLeft = (row) => {
  const values = row.filter((value) => value !== 0);
  let gained = 0;

  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] !== 0 && values[i] === values[i + 1]) {
      values[i] *= 2;
      gained += values[i];
      values[i + 1] = 0;
    }
  }

  const merged = values.filter((value) => value !== 0);
  while (merged.length < GRID_SIZE) {
    merged.push(0);
  }

  return { row: merged, gained };
};

const reverse = (row) => [...row].reverse();

const transpose = (grid) =>
  grid[0].map((_, colIndex) => grid.map((row) => row[colIndex]));

// Applies a move in the given direction to the grid. Nothing here mutates
// the input grid. Returns:
//   grid   - the resulting grid after sliding/merging (no new tile added)
//   gained - the score earned from merges this move
//   moved  - whether anything on the board actually changed
export const move = (grid, direction) => {
  let workingGrid;
  let needsTranspose = false;
  let needsReverse = false;

  switch (direction) {
    case DIRECTIONS.LEFT:
      workingGrid = grid;
      break;
    case DIRECTIONS.RIGHT:
      workingGrid = grid.map(reverse);
      needsReverse = true;
      break;
    case DIRECTIONS.UP:
      workingGrid = transpose(grid);
      needsTranspose = true;
      break;
    case DIRECTIONS.DOWN:
      workingGrid = transpose(grid).map(reverse);
      needsTranspose = true;
      needsReverse = true;
      break;
    default:
      workingGrid = grid;
  }

  let gained = 0;
  let resultGrid = workingGrid.map((row) => {
    const { row: slidRow, gained: rowGained } = slideRowLeft(row);
    gained += rowGained;
    return slidRow;
  });

  if (needsReverse) {
    resultGrid = resultGrid.map(reverse);
  }
  if (needsTranspose) {
    resultGrid = transpose(resultGrid);
  }

  const moved = JSON.stringify(grid) !== JSON.stringify(resultGrid);

  return { grid: resultGrid, gained, moved };
};

// True if there is at least one legal move left: an empty cell, or two
// equal, adjacent tiles (horizontally or vertically) that could merge.
export const canMove = (grid) => {
  if (getEmptyCells(grid).length > 0) {
    return true;
  }

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const value = grid[row][col];
      const right = grid[row][col + 1];
      const below = grid[row + 1] ? grid[row + 1][col] : undefined;
      if (value === right || value === below) {
        return true;
      }
    }
  }

  return false;
};

// True once any tile has reached the winning value.
export const hasWon = (grid) => grid.some((row) => row.some((value) => value >= WINNING_VALUE));

export const readHighScore = () => {
  const stored = Number(localStorage.getItem(HIGH_SCORE_KEY));
  return Number.isFinite(stored) ? stored : 0;
};

export const writeHighScore = (score) => {
  localStorage.setItem(HIGH_SCORE_KEY, String(score));
};

export const TILE_COLORS = {
  2: { background: '#eee4da', color: '#776e65' },
  4: { background: '#ede0c8', color: '#776e65' },
  8: { background: '#f2b179', color: '#f9f6f2' },
  16: { background: '#f59563', color: '#f9f6f2' },
  32: { background: '#f67c5f', color: '#f9f6f2' },
  64: { background: '#f65e3b', color: '#f9f6f2' },
  128: { background: '#edcf72', color: '#f9f6f2' },
  256: { background: '#edcc61', color: '#f9f6f2' },
  512: { background: '#edc850', color: '#f9f6f2' },
  1024: { background: '#edc53f', color: '#f9f6f2' },
  2048: { background: '#edc22e', color: '#f9f6f2' },
};

export const getTileColors = (value) =>
  TILE_COLORS[value] || { background: '#3c3a32', color: '#f9f6f2' };
