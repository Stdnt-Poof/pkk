import { useState } from 'react'

const settingsSections = [
  'Your account',
  'Security and account access',
  'Privacy and safety',
  'Notifications',
  'Accessibility, display, and languages',
]

function SettingsPage() {
  const [isActive, setisActive] = useState('Notifications')

  return (
    <div className="page-layout settings-page-layout">
      <main className="center-content settings-menu">
        <h1 className="settings-heading">Settings</h1>

        <nav className="settings-navigation">
          {settingsSections.map((section) => (
            <button
              key={section}
              type="button"
              className={`settings-nav-item${
                section === isActive ? ' is-active' : ''
              }`}
              onClick={() => setisActive(section)}
            >
              {section}
            </button>
          ))}
        </nav>
      </main>

      <aside className="right-sidebar settings-detail">
        {isActive === 'Notifications' ? (
          <>
            <h2>Notifications</h2>
            <p className="settings-description">
              Select the kinds of notifications you get about your activities,
              interests, and recommendations.
            </p>

            <div className="settings-option-list">
              <div className="settings-option">
                <h3>Filters</h3>
                <p>
                  Choose the notifications you would like to see and those you
                  would not.
                </p>
              </div>

              <div className="settings-option">
                <h3>Preferences</h3>
                <p>Select your preferences by notification type.</p>
              </div>
            </div>
          </>
        ) : (
          <div className="feed-content">
            <p className="feed-empty">Nothing here yet.</p>
          </div>
        )}
      </aside>
    </div>
  )
}

export default SettingsPage