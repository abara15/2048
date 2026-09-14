import { DIRECTIONS, addRandomTile, canMove, move } from './gameLogic';

describe('move', () => {
  test('slides and merges left correctly', () => {
    const grid = [
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { grid: result, gained, moved } = move(grid, DIRECTIONS.LEFT);
    expect(result[0]).toEqual([4, 0, 0, 0]);
    expect(gained).toBe(4);
    expect(moved).toBe(true);
  });

  test('does not double merge a chain of three equal tiles', () => {
    const grid = [
      [2, 2, 2, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { grid: result, gained } = move(grid, DIRECTIONS.LEFT);
    expect(result[0]).toEqual([4, 2, 0, 0]);
    expect(gained).toBe(4);
  });

  test('reports moved=false when nothing changes', () => {
    const grid = [
      [2, 4, 8, 16],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const { moved } = move(grid, DIRECTIONS.LEFT);
    expect(moved).toBe(false);
  });

  test('does not mutate the input grid (movements used to mutate shared state)', () => {
    const grid = [
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const before = JSON.stringify(grid);
    move(grid, DIRECTIONS.UP);
    move(grid, DIRECTIONS.DOWN);
    expect(JSON.stringify(grid)).toBe(before);
  });
});

describe('addRandomTile', () => {
  test('does not loop forever or throw when the grid is already full', () => {
    const fullGrid = Array.from({ length: 4 }, () => [2, 4, 2, 4]);
    const result = addRandomTile(fullGrid);
    expect(result).toEqual(fullGrid);
  });
});

describe('canMove', () => {
  test('returns false when the grid is full with no adjacent equal tiles', () => {
    const grid = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    expect(canMove(grid)).toBe(false);
  });

  test('returns true when a merge is still possible', () => {
    const grid = [
      [2, 2, 4, 2],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    expect(canMove(grid)).toBe(true);
  });
});
