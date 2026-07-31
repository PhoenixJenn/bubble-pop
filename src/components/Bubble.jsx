export default function Bubble({ color, value, isIcon, iconChar, onClick }) {
  return (
    <button
      type="button"
      className={`bubble bubble--${color}${isIcon ? ' bubble--icon' : ''}`}
      onClick={onClick}
      aria-label={isIcon ? 'icon tile' : `${color} tile value ${value}`}
    >
      {isIcon ? (
        <span className="bubble__icon">{iconChar}</span>
      ) : (
        <span className="bubble__value">{value}</span>
      )}
    </button>
  )
}
