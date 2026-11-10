import { useCallback, useEffect, useRef, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import api from "../lib/api"
import PostFeed from "../components/PostFeed.jsx"
import { SkeletonSearchResults, SkeletonUnreadPanel } from "../components/skeleton.jsx"

/* ============================================================================
   Member search — typeahead over OTHER members (self is excluded server-side).
   Click a result, or press Enter, to open /Profile/:username
   ============================================================================ */
function MemberSearch() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [open, setOpen] = useState(false)
  // Enter pressed while results were still loading — jump once they land.
  const enterPending = useRef(false)

  const selectMember = useCallback(
    (member) => {
      enterPending.current = false
      setQuery("")
      setResults([])
      setOpen(false)
      navigate(`/Profile/${member.username}`)
    },
    [navigate]
  )

  useEffect(() => {
    const term = query.trim()
    if (!term) return undefined

    let cancelled = false
    const timer = setTimeout(() => {
      api(`/users/search?q=${encodeURIComponent(term)}`)
        .then((payload) => {
          if (cancelled) return
          const list = payload?.data ?? []
          setResults(list)
          setSearching(false)
          if (enterPending.current) {
            enterPending.current = false
            if (list.length > 0) selectMember(list[0])
          }
        })
        .catch(() => {
          if (cancelled) return
          enterPending.current = false
          setResults([])
          setSearching(false)
        })
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query, selectMember])

  function handleQueryChange(e) {
    const value = e.target.value
    setQuery(value)
    if (!value.trim()) {
      enterPending.current = false
      setResults([])
      setSearching(false)
    } else {
      setSearching(true)
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      enterPending.current = false
      setOpen(false)
      return
    }
    if (e.key !== "Enter") return
    e.preventDefault()
    if (!query.trim()) return
    if (searching) {
      // Results are on their way — open the first match when it lands.
      enterPending.current = true
      return
    }
    if (results.length > 0) selectMember(results[0])
  }

  const showDropdown = open && Boolean(query.trim())

  return (
    <div className="search-wrap">
      <input
        className="search-bar"
        type="search"
        placeholder="Search people"
        aria-label="Search people"
        aria-expanded={showDropdown}
        aria-controls="member-search-results"
        value={query}
        onChange={handleQueryChange}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={handleKeyDown}
      />

      {showDropdown ? (
        <div
          id="member-search-results"
          className="search-results"
          role="listbox"
          aria-label="Member search results"
          onMouseDown={(e) => e.preventDefault()}
        >
          {searching && results.length === 0 ? (
            <SkeletonSearchResults />
          ) : results.length === 0 ? (
            <p className="search-results-empty">No people found</p>
          ) : (
            results.map((member, index) => (
              <button
                key={member.id}
                type="button"
                className={index === 0 ? "search-result is-active" : "search-result"}
                role="option"
                aria-selected={index === 0}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectMember(member)}
              >
                {member.avatar_url ? (
                  <img className="search-result-avatar" src={member.avatar_url} alt="" />
                ) : (
                  <span className="search-result-avatar search-result-initial" aria-hidden="true">
                    {member.username?.charAt(0)?.toUpperCase()}
                  </span>
                )}
                <span className="search-result-name">{member.username}</span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  )
}

/* ============================================================================
   Unread messages panel — sum of unread counts across the member's threads.
   ============================================================================ */
function UnreadPanel() {
  const [unread, setUnread] = useState(null) // null = still loading

  useEffect(() => {
    let cancelled = false
    api("/threads")
      .then((payload) => {
        if (!cancelled) {
          const total = (payload?.data ?? []).reduce((sum, thread) => sum + (thread.unread ?? 0), 0)
          setUnread(total)
        }
      })
      .catch(() => {
        if (!cancelled) setUnread(0)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="messages-panel">
      <h2>Unread Messages</h2>
      {unread === null ? (
        <SkeletonUnreadPanel />
      ) : (
        <p className="messages-placeholder">
          {unread > 0
            ? `${unread} unread message${unread === 1 ? "" : "s"}`
            : "No unread messages"}
        </p>
      )}
    </section>
  )
}

function Homepage() {
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

          <PostFeed composer />
        </section>
      </main>

      <aside className="right-sidebar">
        <MemberSearch />
        <UnreadPanel />
      </aside>
    </div>
  )
}

export default Homepage
