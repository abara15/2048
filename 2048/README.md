# 2048

A clone of the [2048](https://play2048.co/) puzzle game, built with React.

Play with the arrow keys (or W/A/S/D) on desktop, or swipe on a touchscreen.
Combine matching tiles to reach 2048 — and keep going for a higher score
after you win.

## Running locally

This project uses Create React App. As of this update it runs on
`react-scripts@5` (webpack 5), so it works out of the box on current Node.js
versions — no environment variables or flags needed.

```bash
npm install

# start a dev server at http://localhost:3000
npm start

# create a production build in ./build
npm run build

# run the test suite
npm test
```

## Project structure

- `src/gameLogic.js` — the game rules: sliding/merging tiles, spawning new
  tiles, detecting a win/game-over. Tiles are tracked as individual objects
  with a stable `id` and a `{row, col}` position (not just values in a grid),
  which is what lets the UI animate a tile actually *sliding* to its new
  spot instead of just redrawing values in place. Pure functions with no
  React or DOM dependencies, so they're straightforward to unit test.
- `src/App.js` — the UI: renders the board in two phases per move (slide,
  then settle/spawn) so the CSS transition has something to animate, and
  wires up keyboard and touch controls (with `touchmove` blocked on the
  board so swiping doesn't drag the page on mobile).
- `src/App.css` — styling, layout, and the tile slide/merge/spawn animations.

## Notes on this version

This is an updated pass over an earlier version of the project that fixed a
handful of bugs in the original game logic (tiles merging on stale board
state, an infinite loop when the board was full, and a couple of missing/unused
dependencies), upgraded the build tooling to `react-scripts@5` so it runs on
current Node.js without extra flags, and gave the UI a cleaner, more polished
look.
