import { useCallback, useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import api from "../lib/api"
import RatingStars from "../components/RatingStars"
import { SkeletonConversation, SkeletonDmList } from "../components/skeleton"
import defaultPfp from "../assets/Default.jpg"
import { IconStar } from "../components/icons"

const THREAD_POLL_MS = 5000
const LIST_POLL_MS = 10000

function Conversation({ partnerId, serviceParam, onSent }) {
  const [partner, setPartner] = useState(null)
  const [messages, setMessages] = useState([])
  const [service, setService] = useState(null)
  const [canRate, setCanRate] = useState(false)
  const [myRating, setMyRating] = useState(null)
  const [theirRating, setTheirRating] = useState(null)
  const [draft, setDraft] = useState("")
  const [error, setError] = useState("")
  const afterRef = useRef(0)
  const bodyRef = useRef(null)

  const loadThread = useCallback(
    async (fresh) => {
      try {
        const after = fresh || !afterRef.current ? "" : `&after=${afterRef.current}`
        const payload = await api(`/messages?with=${partnerId}${after}`)
        const data = payload.data

        setPartner(data.user)
        setCanRate(data.can_rate)
        setMyRating(data.my_rating)
        setTheirRating(data.their_rating)
        if (data.service) {
          setService(data.service)
        }

        if (fresh) {
          setMessages(data.messages)
        } else if (data.messages.length > 0) {
          setMessages((prev) => [...prev, ...data.messages])
        }

        if (data.messages.length > 0) {
          afterRef.current = data.messages[data.messages.length - 1].id
        }

        setError("")
      } catch (err) {
        setError(err.message || "Could not load the conversation.")
      }
    },
    [partnerId],
  )

  // A chat opened from a Hire card carries its service as a URL param
  // until the first message exists server-side.
  useEffect(() => {
    if (!serviceParam) {
      return
    }

    let cancelled = false

    api(`/services/${serviceParam}`)
      .then((payload) => {
        if (!cancelled) {
          setService({ id: payload.data.id, title: payload.data.title })
        }
      })
      .catch(() => {
        // Stale param — the thread's own service chip still applies.
      })

    return () => {
      cancelled = true
    }
  }, [serviceParam])

  useEffect(() => {
    void loadThread(true)
  }, [loadThread])

  useEffect(() => {
    const timer = setInterval(() => {
      void loadThread(false)
    }, THREAD_POLL_MS)
    return () => clearInterval(timer)
  }, [loadThread])

  useEffect(() => {
    const body = bodyRef.current
    if (body) {
      body.scrollTop = body.scrollHeight
    }
  }, [messages])

  async function handleSend(e) {
    e.preventDefault()

    const body = draft.trim()

    if (!body || !partner) {
      return
    }

    try {
      const payload = await api("/messages", {
        method: "POST",
        body: {
          recipient_id: partner.id,
          body,
          ...(serviceParam ? { service_id: serviceParam } : {}),
        },
      })

      setMessages((prev) => [...prev, payload.data])
      afterRef.current = payload.data.id
      setDraft("")
      onSent()
    } catch (err) {
      setError(err.message || "Could not send the message.")
    }
  }

  async function handleRate(stars) {
    try {
      const payload = await api("/ratings", {
        method: "POST",
        body: { recipient_id: partner.id, stars },
      })

      setMyRating(stars)
      setPartner((prev) =>
        prev
          ? {
              ...prev,
              rating: payload.data.rating,
              rating_count: payload.data.rating_count,
            }
          : prev,
      )
    } catch (err) {
      setError(err.message || "Could not save the rating.")
    }
  }

  if (!partner) {
    if (error) {
      return (
        <section className="conversation">
          <p className="messages-placeholder">{error}</p>
        </section>
      )
    }

    return <SkeletonConversation />
  }

  return (
    <section className="conversation">
      <header className="dm-header dm-header-split">
        <div className="dm-info">
          <img className="dm-header-avatar no-drag" src={partner.avatar_url || defaultPfp} alt="" />
          <div className="dm-header-user">
            {partner.username}
            <RatingStars rating={partner.rating ?? 0} reviews={partner.rating_count ?? 0} />
          </div>
        </div>
        {service ? <span className="thread-service-chip">About: {service.title}</span> : null}
      </header>

      {canRate ? (
        <div className="rate-bar">
          <span>How did {partner.username} do?</span>
          <div className="rate-picker" role="group" aria-label="Rate this member">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="rate-star"
                onClick={() => handleRate(star)}
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              >
                <IconStar />
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {myRating ? <div className="rate-bar">You rated this member <IconStar /> {myRating}</div> : null}
      {theirRating ? (
        <div className="rate-bar">{partner.username} rated you <IconStar /> {theirRating}</div>
      ) : null}

      <div className="conversation-body" ref={bodyRef}>
        {messages.length === 0 ? (
          <p className="messages-placeholder">
            No messages yet, say hi!
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`chat-bubble${message.sender_id === partner.id ? "" : " is-mine"}`}
            >
              <p>{message.body}</p>
            </div>
          ))
        )}
      </div>

      {error ? <p className="job-form-error">{error}</p> : null}

      <footer className="conversation-composer">
        <form className="composer-form" onSubmit={handleSend}>
          <input
            type="text"
            className="composer-input"
            placeholder="Type a message"
            aria-label="Type a message"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={1000}
            autoFocus
          />
          <button type="submit" className="job-btn job-btn-primary">
            Send
          </button>
        </form>
      </footer>
    </section>
  )
}

function Messagespage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeId = Number(searchParams.get("dm")) || null
  const serviceParam = Number(searchParams.get("service")) || null
  const [threads, setThreads] = useState([])
  const [threadsLoaded, setThreadsLoaded] = useState(false)
  const [search, setSearch] = useState("")

  const loadThreads = useCallback(async () => {
    try {
      const payload = await api("/threads")
      setThreads(payload.data)
    } catch {
      // The open conversation surfaces its own errors.
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    api("/threads")
      .then((payload) => {
        if (!cancelled) {
          setThreads(payload.data)
        }
      })
      .catch(() => {
        // The open conversation surfaces its own errors.
      })
      .finally(() => {
        if (!cancelled) {
          setThreadsLoaded(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      void loadThreads()
    }, LIST_POLL_MS)
    return () => clearInterval(timer)
  }, [loadThreads])

  function openThread(userId) {
    setSearchParams({ dm: String(userId) })
  }

  const visible = threads.filter((thread) =>
    thread.user.username.toLowerCase().includes(search.trim().toLowerCase()),
  )

  return (
    <div className="page-layout messages-page-layout">
      <main className="chats">
        <div className="search-container">
          <input
            type="search"
            className="Search-bar"
            aria-label="Search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="dm-content">
          {!threadsLoaded ? (
            <SkeletonDmList />
          ) : visible.length === 0 ? (
            <p className="messages-placeholder">
              {threads.length === 0
                ? "Nothing here yet..."
                : "No member matches that search."}
            </p>
          ) : (
            visible.map((thread) => (
              <button
                type="button"
                className={activeId === thread.user.id ? "dm-item is-active" : "dm-item"}
                key={thread.user.id}
                onClick={() => openThread(thread.user.id)}
              >
                <img className="dm-avatar no-drag" src={thread.user.avatar_url || defaultPfp} alt="" />
                <span className="dm-info">
                  <span className="dm-author">{thread.user.username}</span>
                  <span className="dm-preview">{thread.last_message.body}</span>
                </span>
                {thread.unread > 0 ? <span className="dm-unread">{thread.unread}</span> : null}
              </button>
            ))
          )}
        </div>
      </main>
      <aside className="messages">
        {activeId ? (
          <Conversation
            key={activeId}
            partnerId={activeId}
            serviceParam={serviceParam}
            onSent={loadThreads}
          />
        ) : (
          <div className="conversation-empty">
            <div className="msg-img-container">
              <img className="no-drag" src="/temple.svg" alt="Horizent" />
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}

export default Messagespage
