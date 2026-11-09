import Authform from './authform'

/* ============================================================================
   Skeleton loading — grey blocks that pulse while data is fetched.

   Two rules keep it looking right:
   1. Wrap the blocks in the SAME css classes the real component uses
      (.feed-post, .job-card, .settings-rows, ...) so skeleton and real
      content share the exact width/padding and the swap causes no jump.
   2. Blocks are decorative (aria-hidden). The wrapper carries role="status"
      plus visually hidden text, so screen readers still hear "Loading…".

   Usage:
     if (loading) return <SkeletonFeed />        // feed page
     if (loading) return <SkeletonShell />       // auth splash (requireauth)
   ============================================================================ */

/** One pulsing block. Numbers become px (w={40} => width: 40px). */
function Sk({ w, h, block = false, circle = false, className = '' }) {
  const classes = ['sk-block', block ? 'sk-fill' : '', circle ? 'sk-circle' : '', className]
    .filter(Boolean)
    .join(' ')

  return <span className={classes} style={{ width: w, height: h }} aria-hidden="true" />
}

/**
 * Full-page placeholder shown while the stored token is verified
 * (requireauth / redirectifauthed). Mimics HomeShell: sidebar + content.
 * The role (admin or not) is unknown here, so the sidebar is neutral.
 */
export function SkeletonShell() {
  return (
    <div className="app-shell" role="status">
      <span className="sr-only">Loading your account…</span>

      <aside className="left-sidebar">
        <Sk w={28} h={28} circle />
        <div className="sidebar-navigation">
          {Array.from({ length: 5 }).map((_, i) => (
            <Sk key={i} h={18} w={110} />
          ))}
        </div>
        <div className="sidebar-footer">
          <Sk h={18} w={110} />
        </div>
      </aside>

      <div className="outlet-wrapper">
        <div className="feed-header">
          <Sk h={22} w={160} />
        </div>
        <div className="feed-content">
          <Sk h={76} block />
          <Sk h={170} block />
          <Sk h={170} block />
        </div>
      </div>
    </div>
  )
}

/**
 * Login/Signup placeholder (redirectifauthed). Reuses the real Authform
 * wrapper so the card, image and layout match the page that is about to
 * appear. Pass fields={4} for the signup form.
 */
export function SkeletonAuthForm({ fields = 2 }) {
  return (
    <Authform>
      <div className="login-form" role="status">
        <span className="sr-only">Loading your account…</span>
        <Sk h={10} w={70} />
        <Sk h={28} w={230} />
        {Array.from({ length: fields }).map((_, i) => (
          <Sk key={i} h={43} block />
        ))}
        <Sk h={43} block />
      </div>
    </Authform>
  )
}

/** Settings list rows (mirrors the ul.settings-rows of AccInfo). */
export function SkeletonSettingsRows({ rows = 4 }) {
  return (
    <div role="status">
      <span className="sr-only">Loading your account…</span>
      <ul className="settings-rows">
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i}>
            <Sk h={14} w={90} />
            <Sk h={14} w={140} />
          </li>
        ))}
      </ul>
    </div>
  )
}

/** One post card (mirrors PostCard). Decorative — wrap with SkeletonFeed. */
export function SkeletonPostCard() {
  return (
    <article className="feed-post post-card">
      <div className="post-card-top">
        <Sk w={40} h={40} circle />
        <div className="post-identity">
          <Sk h={15} w={130} />
          <Sk h={12} w={95} />
        </div>
        <Sk h={18} w={24} />
      </div>
      <div>
        <Sk h={12} block />
        <Sk h={12} block />
        <Sk h={12} w="70%" />
      </div>
      <div className="post-actions">
        <Sk h={12} w={70} />
        <Sk h={12} w={70} />
      </div>
    </article>
  )
}

/** Feed list placeholder — drop into .feed-content once GET /api/posts exists. */
export function SkeletonFeed({ count = 3 }) {
  return (
    <div className="feed-content" role="status">
      <span className="sr-only">Loading posts…</span>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonPostCard key={i} />
      ))}
    </div>
  )
}

/** One job card (mirrors JobCard). Decorative — wrap with SkeletonJobList. */
export function SkeletonJobCard() {
  return (
    <article className="job-card">
      <Sk h={18} w="55%" />
      <Sk h={12} w={120} />
      <div>
        <Sk h={12} block />
        <Sk h={12} block />
        <Sk h={12} w="70%" />
      </div>
      <div className="job-card-skills">
        <Sk h={24} w={70} />
        <Sk h={24} w={70} />
        <Sk h={24} w={70} />
      </div>
      <Sk h={34} w={120} />
    </article>
  )
}

/** Job list placeholder — drop into .job-list once GET /api/jobs exists. */
export function SkeletonJobList({ count = 4 }) {
  return (
    <div className="job-list" role="status">
      <span className="sr-only">Loading jobs…</span>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonJobCard key={i} />
      ))}
    </div>
  )
}

/** One service card (mirrors the Hire .job-card .service-card). */
export function SkeletonServiceCard() {
  return (
    <article className="job-card service-card">
      <div className="service-head">
        <Sk w={44} h={44} circle />
        <div className="service-head-info">
          <Sk h={15} w={120} />
          <Sk h={12} w={90} />
        </div>
      </div>
      <Sk h={18} w="55%" />
      <div>
        <Sk h={12} block />
        <Sk h={12} block />
        <Sk h={12} w="70%" />
      </div>
      <div className="job-card-skills">
        <Sk h={24} w={70} />
        <Sk h={24} w={70} />
        <Sk h={24} w={70} />
      </div>
      <div className="job-card-actions">
        <Sk h={18} w={80} />
        <Sk h={34} w={110} />
      </div>
    </article>
  )
}

/** Hire browse list placeholder. */
export function SkeletonServiceList({ count = 4 }) {
  return (
    <div className="job-list" role="status">
      <span className="sr-only">Loading services…</span>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonServiceCard key={i} />
      ))}
    </div>
  )
}

/** "Your services" manage panel (mirrors .hire-mine). */
export function SkeletonHireMine({ rows = 2 }) {
  return (
    <section className="hire-mine" role="status">
      <span className="sr-only">Loading your services…</span>
      <Sk h={13} w={150} />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="hire-mine-row">
          <Sk h={16} w="40%" />
          <Sk h={14} w={70} />
          <Sk h={20} w={80} />
          <Sk h={32} w={62} />
        </div>
      ))}
    </section>
  )
}

/** One conversation row in the DM list (mirrors .dm-item). */
export function SkeletonDmRow() {
  return (
    <div className="dm-item">
      <Sk w={40} h={40} circle />
      <span className="dm-info">
        <Sk h={13} w={110} />
        <Sk h={11} w={170} />
      </span>
    </div>
  )
}

/** DM thread list placeholder. */
export function SkeletonDmList({ count = 5 }) {
  return (
    <div className="dm-content" role="status">
      <span className="sr-only">Loading conversations…</span>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonDmRow key={i} />
      ))}
    </div>
  )
}

/** Open chat placeholder (mirrors header + bubbles + composer). */
export function SkeletonConversation() {
  return (
    <section className="conversation" role="status">
      <span className="sr-only">Opening conversation…</span>
      <header className="dm-header dm-header-split">
        <div className="dm-info">
          <Sk w={50} h={50} circle />
          <div className="dm-header-user">
            <Sk h={16} w={120} />
            <Sk h={12} w={80} />
          </div>
        </div>
      </header>
      <div className="conversation-body">
        <Sk h={46} w="55%" />
        <Sk h={46} w="65%" />
        <Sk h={38} w="45%" />
        <Sk h={46} w="60%" />
      </div>
      <footer className="conversation-composer">
        <div className="composer-form">
          <Sk h={41} block />
        </div>
      </footer>
    </section>
  )
}

/** Admin services table rows (mirrors the .dash-table body). */
export function SkeletonServiceTable({ rows = 5 }) {
  return (
    <div role="status">
      <span className="sr-only">Loading services…</span>
      <table className="dash-table">
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              <td>
                <Sk h={13} w={90} />
              </td>
              <td>
                <Sk h={13} w="75%" />
              </td>
              <td>
                <Sk h={22} w={70} />
              </td>
              <td>
                <Sk h={13} w={70} />
              </td>
              <td>
                <Sk h={13} w={70} />
              </td>
              <td>
                <Sk h={20} w={75} />
              </td>
              <td>
                <Sk h={28} w={120} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Portfolio/project rows (mirrors .pf-list > .pf-row). */
export function SkeletonPortfolioList({ rows = 3 }) {
  return (
    <div role="status">
      <span className="sr-only">Loading portfolio…</span>
      <ul className="pf-list">
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i}>
            <div className="pf-row">
              <span className="pf-thumb">
                <Sk w="100%" h="100%" block />
              </span>
              <span className="pf-row-body">
                <Sk h={15} w="55%" />
                <span className="pf-row-sub">
                  <Sk h={20} w={70} />
                  <Sk h={12} w={130} />
                </span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** File preview placeholder inside the portfolio viewer (.pf-strip). */
export function SkeletonPreview({ height = 340 }) {
  return (
    <div role="status">
      <span className="sr-only">Loading preview…</span>
      <Sk h={height} block />
    </div>
  )
}

/** Search typeahead dropdown placeholder (mirrors .search-results). */
export function SkeletonSearchResults({ count = 3 }) {
  return (
    <div className="search-results" role="status">
      <span className="sr-only">Searching members…</span>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="search-result" aria-hidden="true">
          <Sk w={32} h={32} circle />
          <Sk h={13} w={110} />
        </div>
      ))}
    </div>
  )
}

/** Unread messages panel placeholder (mirrors .messages-panel). */
export function SkeletonUnreadPanel() {
  return (
    <section className="messages-panel" role="status">
      <h2>Unread Messages</h2>
      <div role="presentation">
        <span className="sr-only">Loading unread messages…</span>
        <Sk h={13} w={150} />
      </div>
    </section>
  )
}

/** Other member's profile page placeholder (mirrors .profile-page). */
export function SkeletonProfile() {
  return (
    <main className="profile-page" role="status">
      <span className="sr-only">Loading profile…</span>
      <div className="profile-bg-media profile-bg-gray" aria-hidden="true" />
      <div className="profile-container">
        <div className="profile-content">
          <div className="profile-header">
            <div className="profile-pfp-wrapper" aria-hidden="true">
              <Sk w={120} h={120} block />
            </div>
            <div className="profile-identity">
              <Sk h={22} w={160} />
              <Sk h={13} w={120} />
            </div>
          </div>
          <div className="profile-bio">
            <Sk h={13} w="60%" />
            <div className="profile-stats">
              <Sk h={13} w={130} />
              <Sk h={13} w={110} />
            </div>
          </div>
          <div className="profile-navigation" aria-hidden="true">
            <Sk h={16} w={80} />
            <Sk h={16} w={95} />
            <Sk h={16} w={85} />
          </div>
        </div>
      </div>
    </main>
  )
}

/** Header + bio placeholder for MemberProfile — renders while the tabs
    (ProfileNav) already fetch in parallel, so only these two sections
    mirror .profile-header/.profile-bio. */
export function SkeletonProfileHeader() {
  return (
    <>
      <section className="profile-header" role="status">
        <span className="sr-only">Loading profile…</span>
        <div className="profile-pfp-wrapper" aria-hidden="true">
          <Sk w={120} h={120} block />
        </div>
        <div className="profile-identity">
          <Sk h={22} w={160} />
          <Sk h={13} w={120} />
        </div>
      </section>
      <section className="profile-bio" aria-hidden="true">
        <Sk h={13} w="60%" />
        <div className="profile-stats">
          <Sk h={13} w={130} />
          <Sk h={13} w={110} />
        </div>
      </section>
    </>
  )
}

/** Overview cards placeholder (mirrors .dash-cards). */
export function SkeletonOverviewCards() {
  return (
    <div className="dash-cards" role="status">
      <span className="sr-only">Loading dashboard numbers…</span>
      <div className="dash-card dash-card-total" aria-hidden="true">
        <Sk h={12} w={90} />
        <Sk h={30} w={80} />
        <Sk h={12} w={150} />
      </div>
      <div className="dash-card dash-card-active" aria-hidden="true">
        <Sk h={12} w={120} />
        <Sk h={30} w={80} />
        <Sk h={12} w={230} />
      </div>
      <div className="dash-card dash-card-reports" aria-hidden="true">
        <Sk h={12} w={70} />
        <Sk h={30} w={80} />
        <Sk h={14} w={95} />
      </div>
    </div>
  )
}

/** Admin table placeholder (mirrors .dash-table). */
export function SkeletonDashTable({ rows = 5, cells = 6 }) {
  return (
    <div role="status">
      <span className="sr-only">Loading table…</span>
      <table className="dash-table" aria-hidden="true">
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cells }).map((_, c) => (
                <td key={c}>
                  <Sk h={13} w="70%" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
