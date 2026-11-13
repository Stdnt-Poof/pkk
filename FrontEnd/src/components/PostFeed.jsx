import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../lib/api"
import { timeAgo } from "../lib/time"
import { useAuth } from "../lib/auth"
import PostCard from "./PostCard"
import { SkeletonFeed } from "./skeleton"
import { IconFace, IconImage, IconX } from "./icons"

/** Most pictures one post can carry — mirrors StorePostRequest. */
const MAX_IMAGES = 4

/** Per-picture upload ceiling in bytes — 5 MB, mirrors the server rule. */
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

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
    images: p.images ?? [],
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
  const [images, setImages] = useState([]) // [{ file, url }] pending attach
  const [posting, setPosting] = useState(false)
  const [composerError, setComposerError] = useState("")
  const fileInputRef = useRef(null)
  const pendingUrlsRef = useRef([]) // live mirror of preview URLs for unmount cleanup

  useEffect(() => {
    pendingUrlsRef.current = images.map(({ url }) => url)
  }, [images])

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

  /* Attach picked or pasted files: type/size checked, capped at
     MAX_IMAGES. Each file gets an object URL for the preview chip. */
  function addImages(fileList) {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith("image/"))
    if (files.length === 0) return

    const room = MAX_IMAGES - images.length
    const accepted = files.slice(0, room).filter((f) => f.size <= MAX_IMAGE_BYTES)
    const overLimit = files.length > room
    const tooBig = files.slice(0, room).some((f) => f.size > MAX_IMAGE_BYTES)

    if (overLimit) {
      setComposerError(`A post can carry at most ${MAX_IMAGES} images.`)
    } else if (tooBig) {
      setComposerError("Images must be 5 MB or smaller.")
    } else {
      setComposerError("")
    }

    if (accepted.length > 0) {
      setImages((prev) => [
        ...prev,
        ...accepted.map((file) => ({ file, url: URL.createObjectURL(file) })),
      ])
    }
  }

  function removeImage(index) {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].url)
      return prev.filter((_, i) => i !== index)
    })
  }

  /* Clipboard paste — only intercept image pastes so plain text keeps
     its default behaviour. */
  function handlePaste(e) {
    const files = Array.from(e.clipboardData?.files || [])
    if (files.length === 0) return
    e.preventDefault()
    addImages(files)
  }

  /* Revoke preview object URLs when they leave the list (remove or
     publish); anything still pending is revoked on unmount. */
  useEffect(() => {
    return () => {
      pendingUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  function handlePost(e) {
    e.preventDefault()
    const text = draft.trim()
    if ((!text && images.length === 0) || posting) return
    setPosting(true)

    const form = new FormData()
    form.append("body", text)
    images.forEach(({ file }) => form.append("images[]", file))

    api("/posts", { method: "POST", form })
      .then((payload) => {
        const post = mapPost(payload?.data ?? {})
        setPosts((prev) => [post, ...(prev ?? [])])
        setDraft("")
        images.forEach(({ url }) => URL.revokeObjectURL(url))
        setImages([])
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
            <div className="post-composer-field">
              <input
                className="composer-input post-composer-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onPaste={handlePaste}
                placeholder="What is happening?"
                aria-label="Create a post"
                maxLength={280}
              />
              <button
                type="button"
                className="post-composer-attach"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Add images"
                title="Add images"
                disabled={images.length >= MAX_IMAGES}
              >
                <IconImage />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="post-composer-file"
                aria-label="Choose images"
                onChange={(e) => {
                  addImages(e.target.files)
                  e.target.value = "" // re-pick the same file later
                }}
              />
            </div>
            {images.length > 0 ? (
              <ul className="post-image-previews">
                {images.map((img, index) => (
                  <li key={img.url}>
                    <img src={img.url} alt={`Attachment ${index + 1}`} />
                    <button
                      type="button"
                      className="post-image-drop"
                      onClick={() => removeImage(index)}
                      aria-label={`Remove image ${index + 1}`}
                      title="Remove"
                    >
                      <IconX />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="post-composer-row">
              <span className="post-composer-count">{draft.length}/280</span>
              <button
                type="submit"
                className="job-btn job-btn-primary"
                disabled={(!draft.trim() && images.length === 0) || posting}
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
