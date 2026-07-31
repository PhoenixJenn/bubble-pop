// targets keys must match either a color name from `colors` or the `iconType` string.
// iconDensity controls roughly what fraction of tiles start as icon tiles.

export const LEVELS = [
  {
    id: 'level-1',
    name: 'First Pop',
    rows: 8,
    cols: 8,
    colors: ['coral', 'teal', 'gold', 'plum'],
    iconType: 'icon',
    iconDensity: 0.10,
    moveLimit: 20,
    targets: { coral: 15, teal: 15, icon: 25 },
    colorValues: { coral: 3, teal: 2, gold: 1, plum: 4, icon: 5 },
    boosters: { bomb: 2, rowClear: 1, colClear: 1, colorBomb: 1 },
  },
  {
    id: 'level-2',
    name: 'Rising Tide',
    rows: 9,
    cols: 9,
    colors: ['coral', 'teal', 'gold', 'plum'],
    iconType: 'icon',
    iconDensity: 0.09,
    moveLimit: 25,
    targets: { coral: 18, teal: 18, gold: 12, icon: 35 },
    colorValues: { coral: 3, teal: 2, gold: 1, plum: 4, icon: 5 },
    boosters: { bomb: 2, rowClear: 1, colClear: 1, colorBomb: 1 },
  },
  {
    id: 'level-3',
    name: 'Galaxy Brain',
    rows: 10,
    cols: 10,
    colors: ['coral', 'teal', 'gold', 'plum'],
    iconType: 'icon',
    iconDensity: 0.08,
    moveLimit: 30,
    targets: { coral: 24, teal: 21, gold: 18, plum: 20, icon: 50 },
    colorValues: { coral: 3, teal: 2, gold: 1, plum: 4, icon: 5 },
    boosters: { bomb: 2, rowClear: 1, colClear: 1, colorBomb: 1 },
  },
]

export function getLevel(levelId) {
  return LEVELS.find((lvl) => lvl.id === levelId) || LEVELS[0]
}
