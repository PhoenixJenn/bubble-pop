// Pure functions for grid state. No React here — keeps this testable in isolation.

let idCounter = 0
function nextId() {
  idCounter += 1
  return idCounter
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * Build a fresh rows×cols grid. Each tile's value comes from colorValues[color]
 * so all tiles of the same color show the same number.
 * If iconType and iconDensity are provided, roughly (density×total) icon tiles
 * are scattered randomly; icon tiles use color=iconType.
 */
export function createGrid(rows, cols, colors, iconType = null, iconDensity = 0, colorValues = {}) {
  const totalCells = rows * cols
  const iconCount = Math.round(totalCells * iconDensity)

  // Fisher-Yates to pick random icon positions
  const indices = Array.from({ length: totalCells }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  const iconSet = new Set(indices.slice(0, iconCount))

  const grid = []
  let idx = 0
  for (let r = 0; r < rows; r++) {
    const row = []
    for (let c = 0; c < cols; c++) {
      if (iconType && iconSet.has(idx)) {
        row.push({ id: nextId(), color: iconType, value: colorValues[iconType] ?? 1, isIcon: true })
      } else {
        const color = randomColor(colors)
        row.push({ id: nextId(), color, value: colorValues[color] ?? 1 })
      }
      idx++
    }
    grid.push(row)
  }
  return grid
}

/** Flood-fill (4-directional) to find all cells connected to (row, col) sharing its color. */
export function getConnectedGroup(grid, row, col) {
  const start = grid[row]?.[col]
  if (!start) return []

  const targetColor = start.color
  const visited = new Set()
  const stack = [[row, col]]
  const group = []

  while (stack.length) {
    const [r, c] = stack.pop()
    const key = `${r}-${c}`
    if (visited.has(key)) continue
    visited.add(key)

    const cell = grid[r]?.[c]
    if (!cell || cell.color !== targetColor) continue

    group.push([r, c])
    stack.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1])
  }

  return group
}

/**
 * Remove the given group of [row, col] coords, drop remaining tiles down,
 * and spawn new tiles at the top of each column.
 * Icon tiles can appear in refills at the same rate as the initial board (iconDensity).
 * Returns a brand-new grid (does not mutate the input).
 */
export function popAndRefill(grid, group, colors, colorValues = {}, iconType = null, iconDensity = 0) {
  const rows = grid.length
  const cols = grid[0].length
  const toRemove = new Set(group.map(([r, c]) => `${r}-${c}`))

  const newGrid = Array.from({ length: rows }, () => new Array(cols).fill(null))

  for (let c = 0; c < cols; c++) {
    const surviving = []
    for (let r = 0; r < rows; r++) {
      if (!toRemove.has(`${r}-${c}`) && grid[r][c]) surviving.push(grid[r][c])
    }
    const missing = rows - surviving.length
    const fresh = Array.from({ length: missing }, () => {
      if (iconType && Math.random() < iconDensity) {
        return { id: nextId(), color: iconType, value: colorValues[iconType] ?? 1, isIcon: true }
      }
      const color = randomColor(colors)
      return { id: nextId(), color, value: colorValues[color] ?? 1 }
    })
    const column = [...fresh, ...surviving]
    for (let r = 0; r < rows; r++) {
      newGrid[r][c] = column[r]
    }
  }

  return newGrid
}

/**
 * Sum each tile's value by color for the popped group.
 * Used to update per-color progress (values accumulate, not raw tile counts).
 */
export function countByColor(grid, group) {
  const counts = {}
  for (const [r, c] of group) {
    const cell = grid[r]?.[c]
    if (!cell) continue
    counts[cell.color] = (counts[cell.color] || 0) + (cell.value || 1)
  }
  return counts
}

/** Sum all tile values in the group — the raw score earned from one pop. */
export function scoreGroup(grid, group) {
  let total = 0
  for (const [r, c] of group) {
    total += grid[r]?.[c]?.value || 1
  }
  return total
}

/** A regular move only counts if it pops 2 or more connected tiles. */
export function isValidMove(group) {
  return group.length >= 2
}

// ─── Booster helpers ───────────────────────────────────────────────────────
// Each returns a list of [r, c] coords to pop; the caller handles the rest.

/** Bomb: 3×3 area around the clicked tile. */
export function getBombGroup(grid, row, col) {
  const group = []
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (grid[r]?.[c]) group.push([r, c])
    }
  }
  return group
}

/** Row clear: every tile in the clicked row. */
export function getRowGroup(grid, row) {
  return grid[row].map((_, c) => [row, c])
}

/** Column clear: every tile in the clicked column. */
export function getColGroup(grid, col) {
  return grid.map((_, r) => [r, col])
}

/** Color bomb: every tile that shares the clicked tile's color. */
export function getColorGroup(grid, row, col) {
  const targetColor = grid[row]?.[col]?.color
  if (!targetColor) return []
  const group = []
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c]?.color === targetColor) group.push([r, c])
    }
  }
  return group
}
