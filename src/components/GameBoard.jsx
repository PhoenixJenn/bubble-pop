import { useState, useRef } from 'react'
import Bubble from './Bubble.jsx'
import HUD from './HUD.jsx'
import ResultModal from './ResultModal.jsx'
import {
  createGrid,
  getConnectedGroup,
  popAndRefill,
  countByColor,
  scoreGroup,
  isValidMove,
  getBombGroup,
  getRowGroup,
  getColGroup,
  getColorGroup,
} from '../game/boardLogic.js'

const BOOSTERS = {
  bomb:      { icon: '💥', label: 'Bomb',  tip: 'Clears a 3×3 area'          },
  rowClear:  { icon: '↔',  label: 'Row',   tip: 'Clears the entire row'       },
  colClear:  { icon: '↕',  label: 'Col',   tip: 'Clears the entire column'    },
  colorBomb: { icon: '✦',  label: 'Color', tip: 'Clears all tiles of one color' },
}

function buildInitialState(level) {
  return {
    grid: createGrid(level.rows, level.cols, level.colors, level.iconType, level.iconDensity, level.colorValues),
    movesRemaining: level.moveLimit,
    progress: Object.fromEntries(Object.keys(level.targets).map((k) => [k, 0])),
    score: 0,
    boosters: { ...level.boosters },
    selectedBooster: null,
    status: 'playing',
  }
}

function getBoosterGroup(grid, booster, row, col) {
  switch (booster) {
    case 'bomb':      return getBombGroup(grid, row, col)
    case 'rowClear':  return getRowGroup(grid, row)
    case 'colClear':  return getColGroup(grid, col)
    case 'colorBomb': return getColorGroup(grid, row, col)
    default:          return []
  }
}

export default function GameBoard({ level, levelNumber, isLastLevel, iconChar, highScore, onScoreUpdate, onBack, onNextLevel }) {
  const [state, setState] = useState(() => buildInitialState(level))
  const [starBursts, setStarBursts] = useState([])
  const boardRef = useRef(null)

  function launchStarBurst(iconCells) {
    if (!boardRef.current || iconCells.length === 0) return
    const rect = boardRef.current.getBoundingClientRect()
    const cellW = rect.width / level.cols
    const cellH = rect.height / level.rows
    const avgRow = iconCells.reduce((s, [r]) => s + r, 0) / iconCells.length
    const avgCol = iconCells.reduce((s, [, c]) => s + c, 0) / iconCells.length
    const x = rect.left + (avgCol + 0.5) * cellW
    const y = rect.top + (avgRow + 0.5) * cellH
    const spread = 40 + iconCells.length * 8
    const angle = -(50 + (Math.random() - 0.5) * spread)
    setStarBursts(prev => [
      ...prev,
      { id: Date.now() + Math.random(), x, y, angle, size: Math.min(iconCells.length, 8) },
    ])
  }

  function handleReplay() {
    setState(buildInitialState(level))
  }

  function handleBoosterSelect(key) {
    setState((prev) => ({
      ...prev,
      selectedBooster: prev.selectedBooster === key ? null : key,
    }))
  }

  function handleBubbleClick(row, col) {
    if (state.status !== 'playing') return

    const { selectedBooster, grid } = state
    let group
    let usingBooster = false

    if (selectedBooster) {
      group = getBoosterGroup(grid, selectedBooster, row, col)
      usingBooster = true
    } else {
      group = getConnectedGroup(grid, row, col)
      if (!isValidMove(group)) return
    }

    const iconCells = group.filter(([r, c]) => grid[r]?.[c]?.isIcon)
    if (iconCells.length > 0) launchStarBurst(iconCells)

    const gained = countByColor(grid, group)
    const points = scoreGroup(grid, group)
    const nextGrid = popAndRefill(grid, group, level.colors, level.colorValues, level.iconType, level.iconDensity)

    const nextProgress = { ...state.progress }
    for (const [color, val] of Object.entries(gained)) {
      if (color in nextProgress) nextProgress[color] += val
    }

    const nextMoves = usingBooster ? state.movesRemaining : state.movesRemaining - 1
    const allMet = Object.entries(level.targets).every(
      ([color, target]) => (nextProgress[color] || 0) >= target,
    )

    let nextStatus = 'playing'
    if (allMet) nextStatus = 'won'
    else if (nextMoves <= 0) nextStatus = 'lost'

    const nextBoosters = usingBooster
      ? { ...state.boosters, [selectedBooster]: state.boosters[selectedBooster] - 1 }
      : state.boosters

    const newScore = state.score + points
    onScoreUpdate(newScore)

    setState({
      grid: nextGrid,
      movesRemaining: nextMoves,
      progress: nextProgress,
      score: newScore,
      boosters: nextBoosters,
      selectedBooster: null,
      status: nextStatus,
    })
  }

  return (
    <div className="game-board-wrapper">
      <div className="game-board-topbar">
        <button type="button" className="back-btn" onClick={onBack}>
          ← Levels
        </button>
        <span className="level-label">Level {levelNumber}</span>
      </div>

      <HUD
        movesRemaining={state.movesRemaining}
        targets={level.targets}
        progress={state.progress}
        score={state.score}
        highScore={highScore}
        iconType={level.iconType}
        iconChar={iconChar}
      />

      {starBursts.map(burst => {
        const dist = 160 + burst.size * 40
        return (
          <div
            key={burst.id}
            className={`star-burst star-burst--${burst.size >= 5 ? 'lg' : burst.size >= 3 ? 'md' : 'sm'}`}
            style={{
              left: `${burst.x}px`,
              top: `${burst.y}px`,
              width: `${60 + burst.size * 24}px`,
              '--rotate': `${burst.angle}deg`,
              '--dist': `${dist}px`,
              '--dur': `${0.55 + burst.size * 0.07}s`,
            }}
            onAnimationEnd={() =>
              setStarBursts(prev => prev.filter(b => b.id !== burst.id))
            }
          />
        )
      })}

      <div
        ref={boardRef}
        className={`game-board${state.selectedBooster ? ` game-board--booster` : ''}`}
        data-cols={level.cols}
        style={{
          gridTemplateColumns: `repeat(${level.cols}, 1fr)`,
          gridTemplateRows: `repeat(${level.rows}, 1fr)`,
        }}
      >
        {state.grid.map((row, r) =>
          row.map((cell, c) => (
            <Bubble
              key={cell.id}
              color={cell.color}
              value={cell.value}
              isIcon={cell.isIcon}
              iconChar={cell.isIcon ? iconChar : null}
              onClick={() => handleBubbleClick(r, c)}
            />
          )),
        )}
      </div>

      <div className="game-scene" aria-hidden="true">
        <div className="game-scene__sky" />
        <div className="game-scene__ground" />
        <div className="game-scene__palm game-scene__palm--left" />
        <div className="game-scene__palm game-scene__palm--right" />
      </div>

      <div className="booster-tray">
        <p className="booster-tray__label">BOOSTERS AVAILABLE</p>
        <div className="booster-tray__buttons">
          {Object.entries(BOOSTERS).map(([key, { icon, label, tip }]) => {
            const count = state.boosters[key] || 0
            const isSelected = state.selectedBooster === key
            return (
              <button
                key={key}
                type="button"
                className={`booster-btn${isSelected ? ' booster-btn--selected' : ''}${count === 0 ? ' booster-btn--empty' : ''}`}
                onClick={() => handleBoosterSelect(key)}
                disabled={count === 0 || state.status !== 'playing'}
                aria-label={`${label} booster, ${count} remaining`}
                data-tooltip={tip}
              >
                <span className="booster-btn__icon">{icon}</span>
                <span className="booster-btn__count">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      <ResultModal
        status={state.status}
        score={state.score}
        isLastLevel={isLastLevel}
        onReplay={handleReplay}
        onNextLevel={onNextLevel}
        onBack={onBack}
      />
    </div>
  )
}
