import { NavLink } from "react-router-dom"

// Temporary dummy posts to test scrolling with the sticky sidebar
const DUMMY_POSTS = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  author: `User ${i + 1}`,
  handle: `@user${i + 1}`,
  text: `This is dummy post #${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
}))

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
            {DUMMY_POSTS.map((post) => (
              <article key={post.id} className="feed-post">
                <h3>{post.author} <span>{post.handle}</span></h3>
                <p>{post.text}</p>
              </article>
            ))}
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
