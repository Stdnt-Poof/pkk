import { useState } from "react"
import { MOCK_POSTS } from "../../data/mockPosts"

/* Home feed moderation — per-user LIST VIEW ONLY: short text snippet, tags,
   reaction counts. Post bodies are never rendered in full on this page. */

const SNIPPET_LEN = 96

function snippet(text) {
  return text.length > SNIPPET_LEN ? `${text.slice(0, SNIPPET_LEN).trimEnd()}…` : text
}

function DashHomePosts() {
  const [posts, setPosts] = useState(MOCK_POSTS)

  function setStatus(id, status) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
  }

  function remove(id) {
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <section className="dash-panel">
      <h2>Home posts — {posts.length} live</h2>
      <p className="dash-note">Feed posts on the home page, per user. Snippets only — no full bodies.</p>
      {posts.length === 0 ? (
        <p className="dash-empty">Nothing posted right now.</p>
      ) : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Post</th>
              <th>Tags</th>
              <th>Reactions</th>
              <th>Posted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => {
              const status = post.status || "Published"
              return (
                <tr key={post.id}>
                  <td>
                    <strong>{post.author}</strong><br />
                    <span className="dash-dim">{post.handle}</span>
                  </td>
                  <td>
                    <span className="dash-snippet">{snippet(post.text)}</span>
                  </td>
                  <td>
                    <div className="dash-tags">
                      {(post.tags || []).map((tag) => (
                        <span key={tag} className="job-skill-tag">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    {post.likes} likes · {post.comments.length} comments
                  </td>
                  <td>{post.time}</td>
                  <td>
                    <span className={`dash-badge ${status === "Published" ? "good" : "off"}`}>
                      {status}
                    </span>
                  </td>
                  <td>
                    <div className="dash-actions">
                      <button
                        type="button"
                        className="dash-btn"
                        onClick={() => setStatus(post.id, status === "Published" ? "Hidden" : "Published")}
                      >
                        {status === "Published" ? "Hide" : "Publish"}
                      </button>
                      <button type="button" className="dash-btn danger" onClick={() => remove(post.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
      <p className="dash-note">Hidden posts stay on the platform but disappear from the home feed.</p>
    </section>
  )
}

export default DashHomePosts
