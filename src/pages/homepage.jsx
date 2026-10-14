import { useState } from "react"
import { NavLink } from "react-router-dom"
import PostCard from "../components/PostCard.jsx"
import { MOCK_POSTS } from "../data/mockPosts.js"

/* ============================================================================
   BACKEND NEEDED — FE-only mock, replace with real API (wrapped section START)
   ----------------------------------------------------------------------------
   What is currently masked as FE here and needs a BE:
   - GET    /api/posts            -> feed list (replaces MOCK_POSTS + useState)
   - POST   /api/posts            -> create post (replaces handlePost local prepend)
   - POST   /api/posts/:id/like   -> toggle like (replaces onToggleLike)
   - POST   /api/posts/:id/save   -> toggle save/bookmark (replaces onToggleSave)
   - GET    /api/posts/:id/comments
   - POST   /api/posts/:id/comments       -> add comment (replaces onAddComment)
   - POST   /api/comments/:id/like        -> like a comment (replaces onToggleCommentLike)
   - GET    /api/posts/:id/views or view ping for impression counts
   Everything between BE-MOCK-START and BE-MOCK-END below is local-only state
   and must be deleted once the endpoints above land (keep <PostCard /> usage).
   ============================================================================ */
// --- BE-MOCK-START (feed state: likes, saves, comments, composer) ---

function Homepage() {
  const [posts, setPosts] = useState(MOCK_POSTS)
  const [composer, setComposer] = useState("")

  function updatePost(id, fn) {
    setPosts((prev) => prev.map((p) => (p.id === id ? fn(p) : p)))
  }

  function handlePost(e) {
    e.preventDefault()
    const text = composer.trim()
    if (!text) return
    const post = {
      id: `post-${Date.now()}`,
      author: "You",
      handle: "@you",
      time: "now",
      text,
      tags: [],
      likes: 0,
      views: 0,
      liked: false,
      saved: false,
      comments: [],
    }
    setPosts((prev) => [post, ...prev])
    setComposer("")
  }

  function handleToggleLike(id) {
    updatePost(id, (p) => ({
      ...p,
      liked: !p.liked,
      likes: p.likes + (p.liked ? -1 : 1),
    }))
  }

  function handleToggleSave(id) {
    updatePost(id, (p) => ({ ...p, saved: !p.saved }))
  }

  function handleAddComment(postId, text) {
    updatePost(postId, (p) => ({
      ...p,
      comments: [
        ...p.comments,
        {
          id: `c-${Date.now()}`,
          author: "You",
          handle: "@you",
          time: "now",
          text,
          likes: 0,
          liked: false,
        },
      ],
    }))
  }

  function handleToggleCommentLike(postId, commentId) {
    updatePost(postId, (p) => ({
      ...p,
      comments: p.comments.map((c) =>
        c.id === commentId
          ? { ...c, liked: !c.liked, likes: c.likes + (c.liked ? -1 : 1) }
          : c,
      ),
    }))
  }
  // --- BE-MOCK-END (everything above is local-only; see banner on top) ---

  return (
    <div className="page-layout home-page-layout">
      <main className="center-content">
        <nav className="primary-navigation" aria-label="Home sections">
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
              to="/Community"
              className={({ isActive }) =>
                `nav-item${isActive ? ' is-active' : ''}`
              }
            >
              <span className="nav-item">Listings</span>
            </NavLink>
          </div>
        </nav>
        <section className="home-feed">

          <header className="feed-header">
            <h1>Home</h1>
          </header>

          <form className="post-composer" onSubmit={handlePost}>
            <div className="post-avatar" aria-hidden="true">Y</div>
            <div className="post-composer-main">
              <input
                className="composer-input post-composer-input"
                value={composer}
                onChange={(e) => setComposer(e.target.value)}
                placeholder="What is happening?"
                aria-label="Create a post"
                maxLength={280}
              />
              <div className="post-composer-row">
                <span className="post-composer-count">{composer.length}/280</span>
                <button
                  type="submit"
                  className="job-btn job-btn-primary"
                  disabled={!composer.trim()}
                >
                  Post
                </button>
              </div>
            </div>
          </form>

          <div className="feed-content">
            {posts.length === 0 ? (
              <p className="feed-empty">No posts yet. Be the first to post.</p>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onToggleLike={handleToggleLike}
                  onToggleSave={handleToggleSave}
                  onAddComment={handleAddComment}
                  onToggleCommentLike={handleToggleCommentLike}
                />
              ))
            )}
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
