# Bubble Pop — Game Spec

An original browser-based bubble-matching game, inspired by the "clear-the-board within a move limit" mechanic (color-matching, limited moves, progressively harder levels). Built with React. This spec covers an **MVP** (playable today) and a **Full Version** (roadmap for later).

---

## 1. Core Mechanic (MVP)

- A grid of colored bubbles (e.g. 8x8).
- Player taps/clicks a bubble. If 2+ adjacent bubbles of the same color are connected (flood-fill), they pop and are removed.
- Bubbles above fall down to fill gaps; new bubbles spawn at the top.
- Player has a **limited number of moves** to clear a **target number of each color** (e.g. "clear 15 red, 15 blue").
- Level ends in **Win** (targets met before moves run out) or **Lose** (moves exhausted).

### MVP Scope
- 1 level, fixed grid, fixed colors, fixed move limit.
- Win/lose screen with "Play Again."
- No accounts, no persistence, no rewards system yet.

---

## 2. Full Version Roadmap (spec now, build later)

- **Worlds**: 4 worlds, each a set of levels with increasing difficulty (smaller move budgets, more colors, obstacles like locked/frozen bubbles).
- **Progression**: unlock next world after clearing all levels in current one; star rating per level (1-3 stars based on moves remaining).
- **Plays system**: limited "plays" per day (e.g. 1 free/day), with bonus plays unlocked by in-app actions (mirrors the real game's "extra play on Monday/Friday" pattern) — for your build, this could map to daily login streaks or simple timed cooldowns instead of purchases.
- **Rewards**: a simple virtual reward table (e.g. "Bonus points," "Badge," "Confetti celebration") triggered on level completion, randomized like an instant-win mechanic.
- **Persistence**: save progress (world/level unlocked, stars, plays remaining) to localStorage (single-player, no backend needed) or a lightweight backend later.
- **Leaderboard** (stretch): optional, would need a backend + auth.

---

## 3. Tech Stack

- **React** (functional components + hooks), Vite for local dev/build.
- **State**: `useState`/`useReducer` for board + game state; no external state library needed at this scale.
- **Styling**: CSS Modules or Tailwind (your call — CSS Modules is simplest to start).
- **Persistence (full version)**: `localStorage`, wrapped in a small `storage.js` utility so it's easy to swap for a backend later.
- No server required for MVP or full single-player version.

---

## 4. Component Architecture

```
src/
  App.jsx                 — top-level: routes MVP game vs (later) world select
  components/
    GameBoard.jsx         — renders grid, handles click/tap, owns flood-fill logic
    Bubble.jsx            — single bubble cell (color, pop animation)
    HUD.jsx                — moves remaining, color targets/progress
    ResultModal.jsx        — win/lose screen, "Play Again"
    WorldSelect.jsx        — (full version) world/level picker
    RewardModal.jsx         — (full version) reward reveal on win
  game/
    boardLogic.js          — grid generation, flood-fill/match detection, gravity/refill
    levelConfig.js          — level definitions (grid size, colors, move limit, targets)
    storage.js               — (full version) localStorage read/write helpers
  App.css / index.css
```

### Key data shapes

```js
// Level config
{
  id: "level-1",
  gridSize: { rows: 8, cols: 8 },
  colors: ["red", "blue", "green", "yellow"],
  moveLimit: 20,
  targets: { red: 15, blue: 15 }
}

// Game state (in GameBoard)
{
  grid: [[{ color: "red", id: "..." }, ...], ...],
  movesRemaining: 20,
  progress: { red: 0, blue: 0 },
  status: "playing" | "won" | "lost"
}
```

---

## 5. Build Order (MVP first)

1. `boardLogic.js`: grid generation + flood-fill match detection (pure functions, easiest to unit test).
2. `GameBoard.jsx`: render grid from state, wire click → boardLogic → re-render.
3. Gravity/refill after a pop.
4. `HUD.jsx`: moves + progress tracking, win/lose detection.
5. `ResultModal.jsx`: end states + replay.
6. Polish: pop animation (CSS transition/scale-fade), sound (optional).
7. **Then**, for full version: level config array → `WorldSelect.jsx` → `storage.js` for persisted progress → `RewardModal.jsx`.

---

## 6. Notes

- This is an original build inspired by the genre of "pop-to-clear, limited-moves" browser games — not a reproduction of any specific company's branded assets, art, or copy. You're free to theme it however you like (colors, names, art) once the mechanic is working.
