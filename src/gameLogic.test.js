import { DIRECTIONS, addRandomTile, canMove, move } from './gameLogic';

const tile = (id, row, col, value) => ({ id, row, col, value });

describe('move', () => {
  test('slides a tile all the way to the wall', () => {
    const tiles = [tile('a', 0, 2, 2)];
    const { settledTiles, moved } = move(tiles, DIRECTIONS.LEFT);
    expect(moved).toBe(true);
    expect(settledTiles).toEqual([{ id: 'a', row: 0, col: 0, value: 2 }]);
  });

  test('merges two equal tiles into one at the landing cell, and keeps the id through slidTiles', () => {
    const tiles = [tile('a', 0, 0, 2), tile('b', 0, 1, 2)];
    const { slidTiles, settledTiles, gained: _ignored, scoreGained } = move(tiles, DIRECTIONS.LEFT);

    // Phase 1: both original tiles land on the same cell (this overlap is
    // what makes them visually slide into each other).
    expect(slidTiles.find((t) => t.id === 'a').col).toBe(0);
    expect(slidTiles.find((t) => t.id === 'b').col).toBe(0);

    // Phase 2: they've collapsed into a single new tile with double value.
    expect(settledTiles).toHaveLength(1);
    expect(settledTiles[0].value).toBe(4);
    expect(settledTiles[0].mergedFrom).toEqual(['a', 'b']);
    expect(scoreGained).toBe(4);
  });

  test('does not double merge a chain of three equal tiles', () => {
    const tiles = [tile('a', 0, 0, 2), tile('b', 0, 1, 2), tile('c', 0, 2, 2)];
    const { settledTiles, scoreGained } = move(tiles, DIRECTIONS.LEFT);
    const values = settledTiles.map((t) => t.value).sort();
    expect(values).toEqual([2, 4]);
    expect(scoreGained).toBe(4);
  });

  test('reports moved=false when nothing changes', () => {
    const tiles = [tile('a', 0, 0, 2), tile('b', 0, 1, 4)];
    const { moved } = move(tiles, DIRECTIONS.LEFT);
    expect(moved).toBe(false);
  });

  test('does not mutate the input tiles array', () => {
    const tiles = [tile('a', 0, 0, 2)];
    const before = JSON.stringify(tiles);
    move(tiles, DIRECTIONS.RIGHT);
    expect(JSON.stringify(tiles)).toBe(before);
  });
});

describe('addRandomTile', () => {
  test('does not loop forever or throw when the board is already full', () => {
    const fullBoard = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        fullBoard.push(tile(`${row}-${col}`, row, col, 2));
      }
    }
    const result = addRandomTile(fullBoard);
    expect(result).toHaveLength(16);
  });
});

describe('canMove', () => {
  test('returns false when the board is full with no adjacent equal tiles', () => {
    const values = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    const tiles = [];
    values.forEach((rowValues, row) => {
      rowValues.forEach((value, col) => tiles.push(tile(`${row}-${col}`, row, col, value)));
    });
    expect(canMove(tiles)).toBe(false);
  });

  test('returns true when a merge is still possible', () => {
    const tiles = [tile('a', 0, 0, 2), tile('b', 0, 1, 2)];
    expect(canMove(tiles)).toBe(true);
  });
});
