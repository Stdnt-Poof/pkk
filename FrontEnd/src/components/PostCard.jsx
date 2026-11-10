import { useState } from "react"
import { useNavigate } from "react-router-dom"
import ReportOverlay from "./ReportOverlay"
import ConfirmOverlay from "./ConfirmOverlay"
import { IconComment, IconFlag, IconHeart, IconShare, IconTrash } from "./icons"
import { useAuth } from "../lib/auth"

function formatCount(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`
  return String(n)
}

function PostCard({ post, onToggleLike, onAddComment, onToggleCommentLike, onReport, onDelete }) {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [expanded, setExpanded] = useState(false)
  const [draft, setDraft] = useState("")
  const [reportOpen, setReportOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  async function submitComment(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    const added = await onAddComment(post.id, text)
    if (added !== false) {
      setDraft("")
      setExpanded(true)
    }
  }

  async function submitReport(reason) {
    const outcome = await onReport?.(post.id, reason)
    if (outcome === null) setReportOpen(false) // success — the overlay closes itself
    return outcome
  }

  function openProfile() {
    if (post.username) navigate(`/Profile/${post.username}`)
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

  function handleDelete() {
    setConfirmOpen(true)
  }

  function confirmDelete() {
    setConfirmOpen(false)
    onDelete?.(post.id)
  }

  return (
    <article className="feed-post post-card">
      <div className="post-card-top">
        <div className="post-avatar" aria-hidden="true">
          {post.author.charAt(0).toUpperCase()}
        </div>
        <div className="post-identity">
          <h3>
            <button
              type="button"
              className="post-author-link"
              onClick={openProfile}
              disabled={!post.username}
            >
              {post.author}
            </button>{" "}
            <span>{post.handle} · {post.time}</span>
          </h3>
          {post.tags?.length ? (
            <div className="post-tags">
              {post.tags.map((t) => (
                <span key={t} className="job-skill-tag">{t}</span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="post-top-actions">
          {!post.is_mine && onReport ? (
            post.flagged ? (
              <span
                className="post-icon-btn is-flagged"
                title="Flagged for review"
                aria-label="Flagged for review"
              >
                <IconFlag />
              </span>
            ) : (
              <button
                type="button"
                className="post-icon-btn"
                onClick={() => setReportOpen(true)}
                aria-label="Report"
                title="Report"
              >
                <IconFlag />
              </button>
            )
          ) : null}
          {post.is_mine || isAdmin ? (
            <button
              type="button"
              className="post-icon-btn is-delete"
              onClick={handleDelete}
              aria-label="Delete post"
              title="Delete"
            >
              <IconTrash />
            </button>
          ) : null}
        </div>
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
            <span aria-hidden="true"><IconComment /></span>
            <span>{formatCount(post.comments.length)}</span>
          </button>
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
            <span aria-hidden="true"><IconHeart /></span>
            <span>{formatCount(post.likes)}</span>
          </button>

          <button type="button" className="post-action" onClick={handleShare} aria-label="Share post" title="Share">
            <span aria-hidden="true"><IconShare /></span>
          </button>
        </div>
      </div>

      {expanded ? (
        <section className="post-comments" aria-label="Comments">
          {post.comments.length === 0 ? (
            <p className="messages-placeholder">No comments yet. Be the first to reply!</p>
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
                    <span aria-hidden="true"><IconHeart /></span>
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

      {reportOpen ? (
        <ReportOverlay
          title="Report this post"
          onClose={() => setReportOpen(false)}
          onSubmit={submitReport}
        />
      ) : null}

      {confirmOpen ? (
        <ConfirmOverlay
          title="Delete post"
          message="Delete this post for everyone? This can't be undone."
          confirmLabel="Delete"
          onClose={() => setConfirmOpen(false)}
          onConfirm={confirmDelete}
        />
      ) : null}
    </article>
  )
}

export default PostCard
