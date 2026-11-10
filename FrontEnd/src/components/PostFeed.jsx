import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../lib/api"
import { timeAgo } from "../lib/time"
import { useAuth } from "../lib/auth"
import PostCard from "./PostCard"
import { SkeletonFeed } from "./skeleton"
import { IconFace } from "./icons"

/** API comment -> PostCard's comment shape (author/handle/time/text). */
function mapComment(c) {
  return {
    id: c.id,
    author: c.author?.username ?? "Member",
    handle: `@${c.author?.username ?? ""}`,
    time: timeAgo(c.created_at),
    text: c.body,
    likes: c.likes ?? 0,
    liked: Boolean(c.liked),
  }
}

/** API post -> PostCard's post shape; PostCard's contract stays stable. */
function mapPost(p) {
  return {
    id: p.id,
    username: p.author?.username,
    author: p.author?.username ?? "Member",
    handle: `@${p.author?.username ?? ""}`,
    time: timeAgo(p.created_at),
    text: p.body,
    tags: p.tags ?? [],
    likes: p.likes ?? 0,
    liked: Boolean(p.liked),
    flagged: Boolean(p.flagged),
    is_mine: Boolean(p.is_mine),
    comments: (p.comments ?? []).map(mapComment),
  }
}

/**
 * The shared post feed — the Home page and a member's profile Post tab use it.
 *
 * `user` scopes the feed to one member (`/posts?user=`); leave it out for the
 * global feed. `composer` adds the create-post box (Home only).
 * Key it by `user` at the call site so switching members remounts cleanly.
 */
function PostFeed({ user, composer = false, emptyText }) {
  const navigate = useNavigate()
  const { user: me } = useAuth()
  const [posts, setPosts] = useState(null) // null = still loading
  const [feedError, setFeedError] = useState("")
  const [draft, setDraft] = useState("")
  const [posting, setPosting] = useState(false)
  const [composerError, setComposerError] = useState("")

  const path = user ? `/posts?user=${encodeURIComponent(user)}` : "/posts"

  useEffect(() => {
    let cancelled = false
    api(path)
      .then((payload) => {
        if (!cancelled) {
          setPosts((payload?.data ?? []).map(mapPost))
          setFeedError("")
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setPosts([])
          setFeedError(error.message || "Could not load posts.")
        }
      })
    return () => {
      cancelled = true
    }
  }, [path])

  function patchPost(id, fn) {
    setPosts((prev) => (prev ?? []).map((p) => (p.id === id ? fn(p) : p)))
  }

  function handleToggleLike(id) {
    api(`/posts/${id}/like`, { method: "POST" })
      .then((payload) => {
        const data = payload?.data ?? {}
        patchPost(id, (p) => ({ ...p, liked: data.liked, likes: data.likes }))
      })
      .catch(() => {
        // The click just doesn't stick; the next tap retries.
      })
  }

  /* The card only disappears once the server confirms the delete; a
     failed call leaves the card in place so the click can be retried. */
  function handleDelete(id) {
    api(`/posts/${id}`, { method: "DELETE" })
      .then(() => setPosts((prev) => (prev ?? []).filter((p) => p.id !== id)))
      .catch(() => {
        // Same as likes: state only changes on a confirmed response.
      })
  }

  /* Resolves to null on success (the report overlay closes) or to an
     error message when the flag could not be filed. */
  function handleReport(id, reason) {
    return api(`/posts/${id}/report`, { method: "POST", body: { reason } })
      .then((payload) => {
        const data = payload?.data ?? {}
        patchPost(id, (p) => ({ ...p, flagged: Boolean(data.flagged) }))
        return null
      })
      .catch((err) => err.message || "Could not file this report. Try again.")
  }

  function handleAddComment(postId, text) {
    return api(`/posts/${postId}/comments`, { method: "POST", body: { body: text } })
      .then((payload) => {
        const comment = mapComment(payload?.data ?? {})
        patchPost(postId, (p) => ({ ...p, comments: [...p.comments, comment] }))
        return true
      })
      .catch(() => false)
  }

  function handleToggleCommentLike(postId, commentId) {
    api(`/comments/${commentId}/like`, { method: "POST" })
      .then((payload) => {
        const data = payload?.data ?? {}
        patchPost(postId, (p) => ({
          ...p,
          comments: p.comments.map((c) => (c.id === commentId ? { ...c, liked: data.liked, likes: data.likes } : c)),
        }))
      })
      .catch(() => {
        // Silent: like state only changes on a confirmed response.
      })
  }

  function handlePost(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text || posting) return
    setPosting(true)
    api("/posts", { method: "POST", body: { body: text } })
      .then((payload) => {
        const post = mapPost(payload?.data ?? {})
        setPosts((prev) => [post, ...(prev ?? [])])
        setDraft("")
        setComposerError("")
      })
      .catch((error) => setComposerError(error.message || "Could not publish your post."))
      .finally(() => setPosting(false))
  }

  const composerAvatar = me?.username?.charAt(0)?.toUpperCase() ?? null

  return (
    <>
      {composer ? (
        <form className="post-composer" onSubmit={handlePost}>
          <div className="post-avatar" aria-hidden="true">{composerAvatar ?? <IconFace />}</div>
          <div className="post-composer-main">
            <input
              className="composer-input post-composer-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="What is happening?"
              aria-label="Create a post"
              maxLength={280}
            />
            <div className="post-composer-row">
              <span className="post-composer-count">{draft.length}/280</span>
              <button
                type="submit"
                className="job-btn job-btn-primary"
                disabled={!draft.trim() || posting}
              >
                {posting ? "Posting…" : "Post"}
              </button>
            </div>
            {composerError ? <p className="job-form-error">{composerError}</p> : null}
          </div>
        </form>
      ) : null}

      {posts === null ? (
        <SkeletonFeed />
      ) : feedError ? (
        <div className="feed-content">
          <p className="feed-empty">{feedError}</p>
        </div>
      ) : (
        <div className="feed-content">
          {posts.length === 0 ? (
            emptyText ? <p className="feed-empty">{emptyText}</p> : null
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onOpenAuthor={post.username ? () => navigate(`/Profile/${post.username}`) : undefined}
                onToggleLike={handleToggleLike}
                onAddComment={handleAddComment}
                onToggleCommentLike={handleToggleCommentLike}
                onReport={post.is_mine ? undefined : handleReport}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}
    </>
  )
}

export default PostFeed
