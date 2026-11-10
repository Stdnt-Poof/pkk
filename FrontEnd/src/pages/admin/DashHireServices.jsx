import { useCallback, useEffect, useState } from "react"
import api from "../../lib/api"
import { formatBudget } from "../../lib/money"
import { SkeletonServiceTable } from "../../components/skeleton"
import ConfirmOverlay from "../../components/ConfirmOverlay"

/* Hire services moderation — LIST VIEW ONLY: provider, service, tags,
   price. Full descriptions are never rendered on this page. */

function DashHireServices() {
  const [services, setServices] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState("")
  const [pendingDelete, setPendingDelete] = useState(null) // service awaiting deletion

  const load = useCallback(async () => {
    try {
      const payload = await api("/admin/services")
      setServices(payload.data)
      setError("")
    } catch (err) {
      setError(err.message || "Could not load services.")
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    api("/admin/services")
      .then((payload) => {
        if (!cancelled) {
          setServices(payload.data)
          setError("")
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Could not load services.")
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoaded(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function setStatus(service, status) {
    try {
      await api(`/admin/services/${service.id}`, { method: "PATCH", body: { status } })
      void load()
    } catch (err) {
      setError(err.message || "Could not update the service.")
    }
  }

  function remove(service) {
    setPendingDelete(service)
  }

  async function confirmDelete() {
    const service = pendingDelete
    setPendingDelete(null)
    if (!service) return

    try {
      await api(`/admin/services/${service.id}`, { method: "DELETE" })
      void load()
    } catch (err) {
      setError(err.message || "Could not delete the service.")
    }
  }

  return (
    <section className="dash-panel">
      <h2>Hire services — {services.length} listed</h2>
      {error ? <p className="dash-note">{error}</p> : null}
      {!loaded ? (
        <SkeletonServiceTable />
      ) : services.length === 0 ? (
        <p className="dash-empty">Nothing offered right now.</p>
      ) : (
        <table className="dash-table">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Service</th>
              <th>Tags</th>
              <th>Price</th>
              <th>Posted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>
                  <strong>{service.provider.username}</strong>
                </td>
                <td>{service.title}</td>
                <td>
                  <div className="dash-tags">
                    {service.tags.map((tag) => (
                      <span key={tag} className="job-skill-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className="job-budget">{formatBudget(service.price, service.currency)}</span>
                </td>
                <td>{new Date(service.created_at).toLocaleDateString()}</td>
                <td>
                  <span className={`dash-badge ${service.status === "published" ? "good" : "off"}`}>
                    {service.status === "published" ? "Published" : "Hidden"}
                  </span>
                </td>
                <td>
                  <div className="dash-actions">
                    <button
                      type="button"
                      className="dash-btn"
                      onClick={() =>
                        setStatus(service, service.status === "published" ? "hidden" : "published")
                      }
                    >
                      {service.status === "published" ? "Hide" : "Publish"}
                    </button>
                    <button type="button" className="dash-btn danger" onClick={() => remove(service)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {pendingDelete ? (
        <ConfirmOverlay
          title="Delete service"
          message={`Delete "${pendingDelete.title}"? This can't be undone.`}
          confirmLabel="Delete"
          onClose={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      ) : null}
    </section>
  )
}

export default DashHireServices
