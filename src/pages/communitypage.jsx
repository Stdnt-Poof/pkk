import { useMemo, useState } from "react"
import JobCard from "../components/community/JobCard"
import JobDetail from "../components/community/JobDetail"
import JobFilterBar from "../components/community/JobFilterBar"
import PostJobModal from "../components/community/PostJobModal"
import { MOCK_JOBS } from "../data/mockJobs"

const STORAGE_KEY = "community-jobs-v1"

function loadStoredJobs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function matchesBudget(job, budget) {
  if (budget === "under100") return job.budget < 100
  if (budget === "100-500") return job.budget >= 100 && job.budget <= 500
  if (budget === "500plus") return job.budget > 500
  return true
}

function Communitypage() {
  const [userJobs, setUserJobs] = useState(loadStoredJobs)
  const [savedIds, setSavedIds] = useState([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [budget, setBudget] = useState("all")
  const [showPost, setShowPost] = useState(false)
  const [activeJob, setActiveJob] = useState(null)

  const allJobs = useMemo(() => [...userJobs, ...MOCK_JOBS], [userJobs])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return allJobs.filter((job) => {
      if (category !== "All" && job.category !== category) return false
      if (!matchesBudget(job, budget)) return false
      if (!q) return true
      const hay = `${job.title} ${job.description} ${job.skills.join(" ")} ${job.author}`.toLowerCase()
      return hay.includes(q)
    })
  }, [allJobs, search, category, budget])

  function toggleSave(id) {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((saved) => saved !== id) : [...prev, id],
    )
  }

  function handlePost(data) {
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
            <p className="messages-placeholder">
              Job offers from people looking for freelancers. Open one for details, reply in
              discussion, or apply via DM.
            </p>
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

      <aside className="right-sidebar">
        <section className="messages-panel">
          <h2>How it works</h2>
          <p className="messages-placeholder">1. Browse job offers below.</p>
          <p className="messages-placeholder">2. Open a card for scope + discussion.</p>
          <p className="messages-placeholder">3. Apply via DM to contact the poster.</p>
        </section>
        <section className="messages-panel">
          <h2>Saved ({savedIds.length})</h2>
          <p className="messages-placeholder">
            {savedIds.length === 0
              ? "Tap Save on any job to shortlist it."
              : "Shortlisted jobs stay marked during this session."}
          </p>
        </section>
      </aside>

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
