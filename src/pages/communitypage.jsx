import { useMemo, useState } from "react"
import JobCard from "../components/community/JobCard"
import JobDetail from "../components/community/JobDetail"
import JobFilterBar from "../components/community/JobFilterBar"
import PostJobModal from "../components/community/PostJobModal"
import { MOCK_JOBS, toUsd } from "../data/mockJobs"

const STORAGE_KEY = "community-jobs-v1"

/* ============================================================================
   BACKEND NEEDED — FE-only mock, replace with real API (wrapped section START)
   ----------------------------------------------------------------------------
   Masked as FE here, needs a BE:
   - GET    /api/jobs (?search=&category=&budget=) -> replaces MOCK_JOBS + localStorage
   - POST   /api/jobs            -> replaces handlePost + localStorage write
   - POST   /api/jobs/:id/save   -> replaces savedIds useState (per-user saved list)
   - GET    /api/jobs/:id/comments
   - POST   /api/jobs/:id/comments -> replaces handleComment local append
   - POST   /api/jobs/:id/apply  -> replaces "Apply via DM" Link (should create/route a DM thread)
   Everything marked BE-MOCK below is local-only and must be deleted once the
   endpoints land (keep <JobCard /> / <JobDetail /> usage).
   ============================================================================ */
// --- BE-MOCK-START (localStorage jobs, session-only saves, local comments) ---

function loadStoredJobs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // Backfill jobs saved before currency existed.
    return parsed.map((job) => ({ currency: "USD", ...job }))
  } catch {
    return []
  }
}

function matchesBudget(job, budget) {
  const usd = toUsd(job)
  if (budget === "under100") return usd < 100
  if (budget === "100-500") return usd >= 100 && usd <= 500
  if (budget === "500plus") return usd > 500
  return true
}

function Communitypage() {
  const [userJobs, setUserJobs] = useState(loadStoredJobs)
  const [savedIds, setSavedIds] = useState([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [budget, setBudget] = useState("all")
  const [currency, setCurrency] = useState("USD")
  const [showPost, setShowPost] = useState(false)
  const [activeJob, setActiveJob] = useState(null)
  // --- BE-MOCK-END (everything above back to loadStoredJobs is local-only) ---

  const allJobs = useMemo(() => [...userJobs, ...MOCK_JOBS], [userJobs])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return allJobs.filter((job) => {
      if ((job.currency || "USD") !== currency) return false
      if (category !== "All" && job.category !== category) return false
      if (!matchesBudget(job, budget)) return false
      if (!q) return true
      const hay = `${job.title} ${job.description} ${job.skills.join(" ")} ${job.author}`.toLowerCase()
      return hay.includes(q)
    })
  }, [allJobs, search, category, budget, currency])

  function toggleSave(id) {
    // BE-MOCK: replace with POST /api/jobs/:id/save (persist per user)
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((saved) => saved !== id) : [...prev, id],
    )
  }

  function handlePost(data) {
    // BE-MOCK: replace with POST /api/jobs then refetch/invalidate job list
    const job = {
      id: `user-${Date.now()}`,
      author: "You",
      handle: "@you",
      postedAt: "Just now",
      proposals: 0,
      comments: [],
      ...data,
    }
    const next = [job, ...userJobs]
    setUserJobs(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // storage unavailable, keep in-memory only
    }
    setShowPost(false)
  }

  function handleComment(jobId, text) {
    // BE-MOCK: replace with POST /api/jobs/:id/comments then sync activeJob from server
    const addTo = (list) =>
      list.map((job) =>
        job.id === jobId
          ? {
              ...job,
              comments: [
                ...job.comments,
                { id: `c-${Date.now()}`, author: "You", text },
              ],
            }
          : job,
      )
    setUserJobs((prev) => addTo(prev))
    setActiveJob((prev) =>
      prev && prev.id === jobId
        ? {
            ...prev,
            comments: [...prev.comments, { id: `c-${Date.now()}`, author: "You", text }],
          }
        : prev,
    )
  }

  return (
    <div className="page-layout community-page-layout">
      <main className="center-content">
        <header className="feed-header community-header">
          <div>
            <h1>Community Jobs</h1>
          </div>
        </header>

        <div className="community-body">
          <JobFilterBar
            search={search}
            onSearch={setSearch}
            category={category}
            onCategory={setCategory}
            budget={budget}
            onBudget={setBudget}
            currency={currency}
            onCurrency={setCurrency}
            onPost={() => setShowPost(true)}
          />

          <section className="job-list" aria-label="Job offers">
            {filtered.length === 0 ? (
              <p className="feed-empty">No jobs match these filters yet.</p>
            ) : (
              filtered.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={savedIds.includes(job.id)}
                  onOpen={setActiveJob}
                  onToggleSave={toggleSave}
                />
              ))
            )}
          </section>
        </div>
      </main>

      {showPost ? (
        <PostJobModal onClose={() => setShowPost(false)} onSubmit={handlePost} />
      ) : null}
      {activeJob ? (
        <JobDetail
          job={activeJob}
          isSaved={savedIds.includes(activeJob.id)}
          onClose={() => setActiveJob(null)}
          onToggleSave={toggleSave}
          onAddComment={handleComment}
        />
      ) : null}
    </div>
  )
}

export default Communitypage
