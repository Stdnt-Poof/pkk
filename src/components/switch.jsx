import { useEffect, useState } from 'react'

function Switch() {
  const [isLight, setIsLight] = useState(() =>
    document.body.classList.contains('light'),
  )

  useEffect(() => {
    document.body.classList.toggle('light', isLight)
  }, [isLight])

  return (
    <button
      className="theme-switch"
      type="button"
      role="switch"
      aria-checked={isLight}
      onClick={() => setIsLight((currentTheme) => !currentTheme)}
    >
        <span className='theme-switch-label'>{isLight ? 'Light Mode' : 'Dark Mode'}</span>
      <span className="theme-switch-track" aria-hidden="true">
        <span className="theme-switch-thumb" />
      </span>
    </button>
  )
}

export default Switch
