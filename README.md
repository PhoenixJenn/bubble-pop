# Bubble Pop

A browser-based color-matching puzzle game (React + Vite) inspired by the Starbucks Summer Game. See `SPEC.md` for the full design doc and roadmap.

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## How it plays

- An 8×8 grid of colored tiles. Each tile has a **number (1–4)** representing its value.
- Click a group of 2+ connected same-color tiles to pop them. Each tile contributes its number toward that color's **target total** (e.g. popping a group of 1+3+4 scores 8 progress toward that color).
- Cleared tiles are replaced via gravity + refill from the top.
- **Priority tiles with larger numbers** — a tile with 4 is worth 4× a tile with 1.
- Each level also has **themed icon tiles** (trees, stars, X marks, etc.) scattered on the board with their own clear target.
- Win by hitting all color + icon targets before your move limit runs out.

## Boosters

4 booster types available per level (limited uses):

| Booster | Effect |
|---------|--------|
| Burst | Clears a 3×3 area around a selected tile |
| Row clear | Clears an entire row |
| Column clear | Clears an entire column |
| Color burst | Clears all tiles of a selected color |

Strategy: save boosters for final moves to finish off remaining targets.

## World & level structure

- **5 themes**, each with a distinct visual style and icon type: Beachy (🌴 palm tree), Christmas (🌲 tree), Tropical (🌺 flower), Starry Night (⭐ star), and Spicy (🌶️ chili pepper)
- **3 levels** of increasing difficulty, playable in any theme:
  - **Pop** — 8×8 grid, 20 moves
  - **Super Pop** — 9×9 grid, 25 moves
  - **Mega Pop** — 10×10 grid, 30 moves
- Themes are cosmetic — switch anytime from the level select screen

## Current build (MVP)

- One playable level: 8×8 grid, 4 colors, 20 moves, clear 12 coral + 12 teal to win
- Basic colored tiles (no numbers yet)
- No boosters, no worlds, no persistence
- Win/lose modal with "Play Again"

## Project structure

```
src/
  App.jsx / App.css         — app shell, styling
  index.css                  — color tokens, fonts, base styles
  components/
    GameBoard.jsx            — owns game state, handles clicks
    Bubble.jsx               — single tile cell
    HUD.jsx                  — moves, score, color progress
    ResultModal.jsx           — win/lose screen
  game/
    boardLogic.js              — pure grid/match/gravity functions (no React)
    levelConfig.js              — level data (add more levels here)
```

## Next steps

1. **Numbered tiles** — add value (1–4) to each tile; update progress tracking to accumulate value on pop
2. **Icon tiles** — add a themed special tile type per world with its own target counter
3. **Boosters** — implement the 4 booster types with limited-use UI
4. **Score** — track and display cumulative score per level
5. **Multiple levels + world select** — expand `levelConfig.js`, add `WorldSelect` screen
6. **Persistence** — `storage.js` to save progress, stars, booster counts to localStorage
7. **Reward modal** — randomized reward reveal on win
