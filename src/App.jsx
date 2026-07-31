import { useState, useEffect } from 'react'
import GameBoard from './components/GameBoard.jsx'
import HowToPlay from './components/HowToPlay.jsx'
import { LEVELS } from './game/levelConfig.js'
import './App.css'

const THEMES = [
  { id: 'beachy',       label: '🌅 Beachy',       iconChar: '🌴' },
  { id: 'tropical',     label: '🌺 Tropical',     iconChar: '🌺' },
  { id: 'starry-night', label: '🌠 Starry Night', iconChar: '⭐' },
  { id: 'spicy',        label: '🌶️ Spicy',        iconChar: '🌶️' },
  { id: 'christmas',    label: '🎄 Christmas',    iconChar: '🌲' },
]

const LEVEL_STARS = ['⭐', '🌟', '💫']

function App() {
  const [themeIdx, setThemeIdx] = useState(0)
  const [levelIdx, setLevelIdx] = useState(null)
  const [highScore, setHighScore] = useState(0)
  const theme = THEMES[themeIdx]

  useEffect(() => {
    document.documentElement.dataset.theme = theme.id
  }, [theme.id])

  function handleScoreUpdate(score) {
    setHighScore((prev) => Math.max(prev, score))
  }

  return (
    <>
      <div className="theme-canvas" aria-hidden="true">
        <div className="beach-scene" />
        <div className="christmas-bg" />
        <div className="tropical-bg" />
        <div className="aurora aurora--1" />
        <div className="aurora aurora--2" />
        <div className="aurora aurora--3" />
        <div className="shooting-star shooting-star--1" />
        <div className="shooting-star shooting-star--2" />
        <div className="shooting-star shooting-star--3" />
        <div className="shooting-star shooting-star--4" />
        <div className="shooting-star shooting-star--5" />
        <div className="spicy-drink spicy-drink--1" />
        <div className="spicy-drink spicy-drink--2" />
        <div className="spicy-drink spicy-drink--3" />
        <div className="spicy-drink spicy-drink--4" />
        <div className="spicy-drink spicy-drink--5" />
        <div className="spicy-drink spicy-drink--6" />
      </div>
      <div className="app">
        <header className="app__header">
          <h1>Bubble Pop</h1>
          {levelIdx === null && <p>Clear the target colors before you run out of moves.</p>}
          <div className="theme-pills">
            {THEMES.map((t, i) => (
              <button
                key={t.id}
                className={`theme-pill${themeIdx === i ? ' theme-pill--active' : ''}`}
                onClick={() => setThemeIdx(i)}
                aria-pressed={themeIdx === i}
              >
                {t.label}
              </button>
            ))}
          </div>
        </header>

        {levelIdx === null ? (
          <div className="level-select">
            <p className="level-select__heading">Choose a Level</p>
            <div className="level-select__cards">
              {LEVELS.map((lvl, i) => (
                <button
                  key={lvl.id}
                  className="level-card"
                  onClick={() => setLevelIdx(i)}
                >
                  <span className="level-card__star">{LEVEL_STARS[i]}</span>
                  <span className="level-card__num">Level {i + 1}</span>
                  <span className="level-card__name">{lvl.name}</span>
                  <span className="level-card__grid">{lvl.cols}×{lvl.rows} grid</span>
                  <span className="level-card__moves">{lvl.moveLimit} moves</span>
                </button>
              ))}
            </div>
            <HowToPlay iconChar={theme.iconChar} />
          </div>
        ) : (
          <GameBoard
            key={levelIdx}
            level={LEVELS[levelIdx]}
            levelNumber={levelIdx + 1}
            isLastLevel={levelIdx === LEVELS.length - 1}
            iconChar={theme.iconChar}
            highScore={highScore}
            onScoreUpdate={handleScoreUpdate}
            onBack={() => setLevelIdx(null)}
            onNextLevel={() => setLevelIdx(levelIdx + 1)}
          />
        )}
      </div>
    </>
  )
}

export default App
