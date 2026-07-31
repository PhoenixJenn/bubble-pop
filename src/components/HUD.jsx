export default function HUD({ movesRemaining, targets, progress, score, highScore, iconType, iconChar }) {
  return (
    <div className="hud">
      <div className="hud__moves">
        <span className="hud__moves-label">MOVES</span>
        <span className="hud__moves-number">{movesRemaining}</span>
      </div>

      <div className="hud__targets">
        {Object.entries(targets).map(([color, target]) => {
          const current = Math.min(progress[color] || 0, target)
          const done = current >= target
          const isIconTarget = color === iconType
          return (
            <div key={color} className={`hud__target${done ? ' hud__target--done' : ''}`}>
              {isIconTarget ? (
                <span className="hud__swatch hud__swatch--icon">{iconChar}</span>
              ) : (
                <span className={`hud__swatch hud__swatch--${color}`} />
              )}
              <span className="hud__target-text">{current}/{target}</span>
            </div>
          )
        })}
      </div>

      <div className="hud__score">
        <span className="hud__high-score">HIGH SCORE {highScore.toLocaleString()}</span>
        <span className="hud__score-number">SCORE {score.toLocaleString()}</span>
      </div>
    </div>
  )
}
