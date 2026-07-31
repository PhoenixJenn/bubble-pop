export default function ResultModal({ status, score, onReplay, onNextLevel, onBack, isLastLevel }) {
  if (status !== 'won' && status !== 'lost') return null

  const isWin = status === 'won'

  return (
    <div className="result-overlay">
      <div className="result-card">
        <h2>{isWin ? 'Level Cleared!' : 'Out of Moves'}</h2>
        <p className="result-card__score">Score: {score.toLocaleString()}</p>
        <p>
          {isWin
            ? isLastLevel
              ? 'You beat all three levels!'
              : 'Ready for the next challenge?'
            : 'Give it another go — the board reshuffles each time.'}
        </p>
        <div className="result-card__actions">
          {isWin && !isLastLevel && (
            <button type="button" className="result-card__button result-card__button--primary" onClick={onNextLevel}>
              Next Level →
            </button>
          )}
          <button type="button" className="result-card__button" onClick={onReplay}>
            {isWin ? 'Replay' : 'Try Again'}
          </button>
          <button type="button" className="result-card__button result-card__button--ghost" onClick={onBack}>
            Level Select
          </button>
        </div>
      </div>
    </div>
  )
}
