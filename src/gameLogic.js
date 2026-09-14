// Core 2048 game logic.
//
// Tiles are tracked as individual objects with a stable `id`, rather than as
// plain numbers in a grid. That's what lets the UI animate a tile *sliding*
// from its old position to its new one instead of just redrawing values in
// place: React can match up DOM nodes by `id` across a move and transition
// their position.
//
// Every function here is pure: it takes tiles (and maybe a direction) and
// returns *new* data rather than mutating its arguments.

export const GRID_SIZE = 4;
export const WINNING_VALUE = 2048;
export const HIGH_SCORE_KEY = '2048-high-score';

export const DIRECTIONS = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

let nextTileId = 1;
const createTileId = () => `tile-${nextTileId++}`;

// A tile is { id, row, col, value }.

const isOccupied = (tiles, row, col) => tiles.some((tile) => tile.row === row && tile.col === col);

const getEmptyCells = (tiles) => {
  const cells = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!isOccupied(tiles, row, col)) {
        cells.push([row, col]);
      }
    }
  }
  return cells;
};

// Returns a new tiles array with a single 2 (90%) or 4 (10%) tile added in a
// random empty cell. If the board is already full, the same array is
// returned unchanged (this used to be an infinite loop bug).
export const addRandomTile = (tiles) => {
  const emptyCells = getEmptyCells(tiles);
  if (emptyCells.length === 0) {
    return tiles;
  }

  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  return [...tiles, { id: createTileId(), row, col, value, isNew: true }];
};

export const createInitialTiles = () => addRandomTile(addRandomTile([]));

// Collapses a single line of tiles (already ordered nearest-wall-first).
// Returns the settled line plus a map of original tile id -> its index in
// the settled line (both tiles in a merge land on the same index, which is
// where the merged tile ends up).
const collapseLine = (line) => {
  const settled = [];
  const landingIndexById = {};
  let scoreGained = 0;

  let i = 0;
  while (i < line.length) {
    const current = line[i];
    const next = line[i + 1];

    if (next && next.value === current.value) {
      const mergedValue = current.value * 2;
      const mergedId = createTileId();
      landingIndexById[current.id] = settled.length;
      landingIndexById[next.id] = settled.length;
      settled.push({ id: mergedId, value: mergedValue, mergedFrom: [current.id, next.id] });
      scoreGained += mergedValue;
      i += 2;
    } else {
      landingIndexById[current.id] = settled.length;
      settled.push({ id: current.id, value: current.value });
      i += 1;
    }
  }

  return { settled, landingIndexById, scoreGained };
};

const LINE_CONFIG = {
  [DIRECTIONS.LEFT]: { axis: 'row', reverse: false },
  [DIRECTIONS.RIGHT]: { axis: 'row', reverse: true },
  [DIRECTIONS.UP]: { axis: 'col', reverse: false },
  [DIRECTIONS.DOWN]: { axis: 'col', reverse: true },
};

// Applies a move in the given direction. Nothing here mutates the input.
// Returns:
//   slidTiles    - original tiles (same ids/values), moved to the position
//                  they slide to. Tiles that are about to merge land on the
//                  same cell as their partner. Render this first so the UI
//                  can transition tiles' positions.
//   settledTiles - the resulting tiles once merges are resolved (fewer
//                  tiles than slidTiles if any merges happened; merged
//                  tiles get a brand new id so the UI can "pop" them in).
//                  No new random tile has been added yet.
//   scoreGained  - points earned from merges this move.
//   moved        - whether anything on the board actually changed.
export const move = (tiles, direction) => {
  const { axis, reverse } = LINE_CONFIG[direction];
  const slidPositionById = {};
  const settledTiles = [];
  let scoreGained = 0;

  for (let lineIndex = 0; lineIndex < GRID_SIZE; lineIndex++) {
    const lineTiles = tiles
      .filter((tile) => (axis === 'row' ? tile.row === lineIndex : tile.col === lineIndex))
      .sort((a, b) => {
        const posA = axis === 'row' ? a.col : a.row;
        const posB = axis === 'row' ? b.col : b.row;
        return reverse ? posB - posA : posA - posB;
      });

    const { settled, landingIndexById, scoreGained: lineScore } = collapseLine(lineTiles);
    scoreGained += lineScore;

    const indexToPosition = (index) => (reverse ? GRID_SIZE - 1 - index : index);

    lineTiles.forEach((tile) => {
      const landingIndex = landingIndexById[tile.id];
      const position = indexToPosition(landingIndex);
      slidPositionById[tile.id] = axis === 'row' ? { row: lineIndex, col: position } : { row: position, col: lineIndex };
    });

    settled.forEach((entry, index) => {
      const position = indexToPosition(index);
      settledTiles.push({
        id: entry.id,
        value: entry.value,
        mergedFrom: entry.mergedFrom,
        row: axis === 'row' ? lineIndex : position,
        col: axis === 'row' ? position : lineIndex,
      });
    });
  }

  const slidTiles = tiles.map((tile) => ({ ...tile, ...slidPositionById[tile.id], isNew: false }));

  const moved = tiles.some((tile) => {
    const landing = slidPositionById[tile.id];
    return landing.row !== tile.row || landing.col !== tile.col;
  });

  return { slidTiles, settledTiles, scoreGained, moved };
};

// True if there is at least one legal move left: an empty cell, or two
// equal, adjacent tiles (horizontally or vertically) that could merge.
export const canMove = (tiles) => {
  if (getEmptyCells(tiles).length > 0) {
    return true;
  }

  const valueAt = {};
  tiles.forEach((tile) => {
    valueAt[`${tile.row},${tile.col}`] = tile.value;
  });

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const value = valueAt[`${row},${col}`];
      const right = valueAt[`${row},${col + 1}`];
      const below = valueAt[`${row + 1},${col}`];
      if (value === right || value === below) {
        return true;
      }
    }
  }

  return false;
};

// True once any tile has reached the winning value.
export const hasWon = (tiles) => tiles.some((tile) => tile.value >= WINNING_VALUE);

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
