import { NavLink } from "react-router-dom"

function Homepage() {
  return (
    <div className="page-layout home-page-layout">
      <main className="center-content">
        <nav className="primary-navigation">
            <div className="center-prime-nav">
              <NavLink
                to="/Home"  
                end
                className={({ isActive }) =>
                  `nav-item${isActive ? ' is-active' : ''}`
                }
              >
                <span className="nav-item">Home</span>
              </NavLink>
            </div>
            <div className="center-prime-nav">
              <NavLink
                to="/Home"
                end
                className={({ isActive }) =>
                  `nav-item${isActive ? ' is-active' : ''}`
                }
              >
                <span className="nav-item">Team</span>
              </NavLink>
            </div>
          </nav>
        <section className="home-feed">

          <header className="feed-header">
            <h1>Home</h1>
          </header>

          <div className="feed-content">
            <p className="feed-empty">Feed Empty.</p>
          </div>
        </section>
      </main>

      <aside className="right-sidebar">
        <input
          className="search-bar"
          type="search"
          placeholder="Search"
          aria-label="Search"
        />

        <section className="messages-panel">
          <h2>Unread Messages</h2>
          <p className="messages-placeholder">No unread messages</p>
        </section>
      </aside>
    </div>
  )
}

export default Homepage
