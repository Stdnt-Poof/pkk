/* Generic on/off switch reusing the sidebar theme-switch visuals. */
function Toggle({ checked, onToggle, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className="theme-switch settings-toggle"
      onClick={() => onToggle(!checked)}
    >
      <span className="settings-toggle-label">{label}</span>
      <span className="theme-switch-track" aria-hidden="true">
        <span className="theme-switch-thumb" />
      </span>
    </button>
  )
}

export default Toggle
