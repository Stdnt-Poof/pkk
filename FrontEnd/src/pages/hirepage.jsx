import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../lib/api"
import { CURRENCIES, formatBudget, getBudgetFilters } from "../lib/money"
import { SERVICE_TAGS } from "../data/serviceTags"
import PostServiceModal from "../components/hire/PostServiceModal"
import ConfirmOverlay from "../components/ConfirmOverlay"
import RatingStars from "../components/RatingStars"
import { SkeletonHireMine, SkeletonServiceList } from "../components/skeleton"
import defaultPfp from "../assets/Default.jpg"

/**
 * One service listing: the provider's identity up top, the offer below
 * and a DM button that opens Messages with the provider already popped.
 */
function ServiceCard({ service, onEdit, onDelete, onDm }) {
  const provider = service.provider

  return (
    <article className="job-card service-card">
      <div className="service-head">
        <img className="service-pfp no-drag" src={provider.avatar_url || defaultPfp} alt="" />
        <div className="service-head-info">
          <strong>{provider.username}</strong>
          <RatingStars rating={provider.rating ?? 0} reviews={provider.rating_count ?? 0} />
        </div>
        {service.status === "hidden" ? <span className="dash-badge off">Hidden</span> : null}
      </div>
      <h3 className="job-card-title">{service.title}</h3>
      <p className="job-card-desc">{service.description}</p>
      <div className="job-card-skills">
        {service.tags.map((tag) => (
          <span key={tag} className="job-skill-tag">
            {tag}
          </span>
        ))}
      </div>
      <div className="job-card-actions">
        <span className="job-budget">{formatBudget(service.price, service.currency)}</span>
        {service.is_mine ? (
          <>
            <button type="button" className="job-btn" onClick={() => onEdit(service)}>
              Edit
            </button>
            <button type="button" className="job-btn job-btn-danger" onClick={() => onDelete(service)}>
              Delete
            </button>
          </>
        ) : (
          <button type="button" className="job-btn job-btn-primary" onClick={() => onDm(service)}>
            DM {provider.username}
          </button>
        )}
      </div>
    </article>
  )
}

function Hirepage() {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [mine, setMine] = useState([])
  const [mineLoaded, setMineLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [tag, setTag] = useState("All")
  const [budget, setBudget] = useState("all")
  const [currency, setCurrency] = useState("")
  const [showPost, setShowPost] = useState(false)
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null) // service awaiting deletion

  const loadMine = useCallback(async () => {
    try {
      const payload = await api("/services?mine=1")
      setMine(payload.data)
    } catch {
      // Browse errors already surface in the main list.
    }
  }, [])

  const load = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        search,
        tag: tag === "All" ? "" : tag,
        budget,
      })
      if (currency) {
        params.set("currency", currency)
      }
      const payload = await api(`/services?${params}`)
      setServices(payload.data)
      setError("")
    } catch (err) {
      setError(err.message || "Could not load services.")
    } finally {
      setLoading(false)
    }
  }, [search, tag, budget, currency])

  useEffect(() => {
    const timer = setTimeout(() => {
      void load()
    }, search ? 300 : 0)
    return () => clearTimeout(timer)
  }, [load, search])

  useEffect(() => {
    let cancelled = false

    api("/services?mine=1")
      .then((payload) => {
        if (!cancelled) {
          setMine(payload.data)
        }
      })
      .catch(() => {
        // Browse errors already surface in the main list.
      })
      .finally(() => {
        if (!cancelled) {
          setMineLoaded(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  function handleDelete(service) {
    setPendingDelete(service)
  }

  async function confirmDelete() {
    const service = pendingDelete
    setPendingDelete(null)
    if (!service) return

    try {
      await api(`/services/${service.id}`, { method: "DELETE" })
      void load()
      void loadMine()
    } catch (err) {
      setError(err.message || "Could not delete the service.")
    }
  }

  function handleSaved() {
    setShowPost(false)
    setEditing(null)
    void load()
    void loadMine()
  }

  function dmTo(service) {
    navigate(`/Messages?dm=${service.provider.id}&service=${service.id}`)
  }

  return (
    <div className="page-layout community-page-layout">
      <main className="center-content">
        <header className="feed-header community-header">
          <div>
            <h1>Hire</h1>
          </div>
        </header>

        <div className="community-body">
          {!mineLoaded ? (
            <SkeletonHireMine />
          ) : mine.length > 0 ? (
            <section className="hire-mine" aria-label="Your services">
              <h2>Your services — {mine.length}</h2>
              {mine.map((service) => (
                <div key={service.id} className="hire-mine-row">
                  <span className="hire-mine-title">{service.title}</span>
                  <span className="job-budget">{formatBudget(service.price, service.currency)}</span>
                  <span className={`dash-badge ${service.status === "published" ? "good" : "off"}`}>
                    {service.status === "published" ? "Published" : "Hidden"}
                  </span>
                  <button type="button" className="job-btn" onClick={() => setEditing(service)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="job-btn job-btn-danger"
                    onClick={() => handleDelete(service)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </section>
          ) : null}

          <div className="job-filterbar">
            <div className="job-filterbar-top">
              <input
                className="search-bar job-search"
                type="search"
                placeholder="Search services, crafts, members"
                aria-label="Search services"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="button" className="job-btn job-btn-primary" onClick={() => setShowPost(true)}>
                Offer a service
              </button>
            </div>
            <div className="job-filterbar-row">
              <div className="job-chip-row" role="group" aria-label="Craft">
                {["All", ...SERVICE_TAGS].map((craft) => (
                  <button
                    key={craft}
                    type="button"
                    className={tag === craft ? "job-chip is-active" : "job-chip"}
                    onClick={() => setTag(craft)}
                  >
                    {craft}
                  </button>
                ))}
              </div>
              <select
                className="job-select"
                aria-label="Budget filter"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              >
                {getBudgetFilters(currency).map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
              <select
                className="job-select"
                aria-label="Currency filter"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="">Any currency</option>
                {CURRENCIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <section className="job-list" aria-label="Services">
            {loading ? (
              <SkeletonServiceList />
            ) : error ? (
              <p className="feed-empty">{error}</p>
            ) : services.length === 0 ? (
              <p className="feed-empty">No services match these filters yet.</p>
            ) : (
              services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onEdit={setEditing}
                  onDelete={handleDelete}
                  onDm={dmTo}
                />
              ))
            )}
          </section>
        </div>
      </main>

      {showPost ? <PostServiceModal onClose={() => setShowPost(false)} onSaved={handleSaved} /> : null}
      {editing ? (
        <PostServiceModal service={editing} onClose={() => setEditing(null)} onSaved={handleSaved} />
      ) : null}
      {pendingDelete ? (
        <ConfirmOverlay
          title="Delete service"
          message={`Delete "${pendingDelete.title}"? This can't be undone.`}
          confirmLabel="Delete"
          onClose={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      ) : null}
    </div>
  )
}

export default Hirepage
