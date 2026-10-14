import { useState } from "react"

function formatCount(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`
  return String(n)
}

function PostCard({ post, onToggleLike, onToggleSave, onAddComment, onToggleCommentLike }) {
  const [expanded, setExpanded] = useState(false)
  const [draft, setDraft] = useState("")

  function submitComment(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    onAddComment(post.id, text)
    setDraft("")
    setExpanded(true)
  }

  async function handleShare() {
    const shareText = `${post.author} ${post.handle}: ${post.text}`
    try {
      if (navigator.share) {
        await navigator.share({ title: "Post", text: shareText })
        return
      }
      await navigator.clipboard.writeText(shareText)
    } catch {
      // user cancelled or clipboard unavailable — no-op
    }
  }

  return (
    <article className="feed-post post-card">
      <div className="post-card-top">
        <div className="post-avatar" aria-hidden="true">
          {post.author.charAt(0).toUpperCase()}
        </div>
        <div className="post-identity">
          <h3>
            {post.author} <span>{post.handle} · {post.time}</span>
          </h3>
          {post.tags?.length ? (
            <div className="post-tags">
              {post.tags.map((t) => (
                <span key={t} className="job-skill-tag">{t}</span>
              ))}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          className={post.saved ? "post-icon-btn is-saved" : "post-icon-btn"}
          onClick={() => onToggleSave(post.id)}
          aria-pressed={post.saved}
          aria-label={post.saved ? "Unsave post" : "Save post"}
          title={post.saved ? "Unsave" : "Save"}
        >
          {post.saved ? "★" : "☆"}
        </button>
      </div>

      <p className="post-text">{post.text}</p>

      <div className="post-actions" role="group" aria-label="Post actions">
        <div className="post-actions-left">
          <button
            type="button"
            className="post-action"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={`${post.comments.length} comments`}
            title="Comments"
          >
            <span aria-hidden="true">💬</span>
            <span>{formatCount(post.comments.length)}</span>
          </button>

          <span className="post-action post-views" title="Views" aria-label={`${post.views} views`}>
            <span aria-hidden="true">📊</span>
            <span>{formatCount(post.views)}</span>
          </span>
        </div>

        <div className="post-actions-right">
          <button
            type="button"
            className={post.liked ? "post-action is-liked" : "post-action"}
            onClick={() => onToggleLike(post.id)}
            aria-pressed={post.liked}
            aria-label={`${post.likes} likes`}
            title="Like"
          >
            <span aria-hidden="true">{post.liked ? "❤️" : "🤍"}</span>
            <span>{formatCount(post.likes)}</span>
          </button>

          <button type="button" className="post-action" onClick={handleShare} aria-label="Share post" title="Share">
            <span aria-hidden="true">📤</span>
          </button>
        </div>
      </div>

      {expanded ? (
        <section className="post-comments" aria-label="Comments">
          {post.comments.length === 0 ? (
            <p className="messages-placeholder">No comments yet. Be the first to reply.</p>
          ) : (
            <ul className="post-comment-list">
              {post.comments.map((c) => (
                <li key={c.id} className="post-comment">
                  <div className="post-comment-main">
                    <strong>
                      {c.author} <span className="post-comment-meta">{c.handle} · {c.time}</span>
                    </strong>
                    <span>{c.text}</span>
                  </div>
                  <button
                    type="button"
                    className={c.liked ? "post-comment-like is-liked" : "post-comment-like"}
                    onClick={() => onToggleCommentLike(post.id, c.id)}
                    aria-pressed={c.liked}
                    aria-label={`Like comment, ${c.likes} likes`}
                    title="Like comment"
                  >
                    <span aria-hidden="true">{c.liked ? "❤️" : "🤍"}</span>
                    <span>{formatCount(c.likes)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <form className="composer-form post-comment-form" onSubmit={submitComment}>
            <input
              className="composer-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a comment..."
              aria-label="Write a comment"
              maxLength={280}
            />
            <button type="submit" className="job-btn job-btn-primary" disabled={!draft.trim()}>
              Reply
            </button>
          </form>
        </section>
      ) : null}
    </article>
  )
}

export default PostCard
