export default function HowToPlay({ iconChar }) {
  return (
    <div className="how-to-play">
      <h3 className="how-to-play__heading">How to Play</h3>
      <ul className="how-to-play__list">

        <li className="how-to-play__tip">
          <div className="how-to-play__visual">
            <span className="mini-tile mini-tile--coral" />
            <span className="mini-tile mini-tile--coral" />
            <span className="mini-tile mini-tile--coral" />
          </div>
          <span>Tap 2+ connected same-color tiles to pop them</span>
        </li>

        <li className="how-to-play__tip">
          <div className="how-to-play__visual">
            <span className="mini-swatch mini-swatch--coral" />
            <span className="mini-swatch mini-swatch--teal" />
            <span className="mini-swatch mini-swatch--gold" />
          </div>
          <span>Clear every color target before you run out of moves</span>
        </li>

        <li className="how-to-play__tip">
          <div className="how-to-play__visual how-to-play__visual--boosters">
            <span className="mini-booster">💥</span>
            <span className="mini-booster">↔</span>
            <span className="mini-booster">↕</span>
            <span className="mini-booster">✦</span>
          </div>
          <span>Boosters clear big areas and never cost a move</span>
        </li>

        <li className="how-to-play__tip">
          <div className="how-to-play__visual">
            <span className="mini-tile mini-tile--icon">{iconChar}</span>
          </div>
          <span>Icon tiles score the most — keep them coming</span>
        </li>

      </ul>
    </div>
  )
}
