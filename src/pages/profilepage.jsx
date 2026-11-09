import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../lib/api"
import ProfileBackground from "../components/FeRenderBg"
import EditProfileModal from "../components/EditProfileModal"
import ReportOverlay from "../components/ReportOverlay"
import UserListOverlay from "../components/UserListOverlay"
import { IconFlag, IconMessage } from "../components/icons"
import ProfileNav from "../components/profilenav"
import RatingStars from "../components/RatingStars"
import { SkeletonProfileHeader } from "../components/skeleton"
import defaultPfp from "../assets/Default.jpg"
import { useAuth } from "../lib/auth"

/* ============================================================================
   Own profile — everything editable. Reached at /Profile (no param).
   ============================================================================ */
function OwnProfile() {
    const { user } = useAuth()
    const [showEdit, setShowEdit] = useState(false)
    const [list, setList] = useState("") // "followers" | "following" | ""

    const pfp = user?.avatar_url || defaultPfp
    const background = user?.cover_url
    const backgroundType = user?.cover_type === "video" ? "video" : "image"

    function openEdit() {
        setShowEdit(true)
    }

    function handleEditKeydown(e) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setShowEdit(true)
        }
    }

    return (
        <main className="profile-page">
            {background ? (
                <ProfileBackground src={background} type={backgroundType} />
            ) : (
                <div className="profile-bg-media profile-bg-gray" aria-hidden="true" />
            )}
            <div className="profile-container">
                <div className="profile-content">
                    <section className="profile-header">
                        <div className="profile-pfp-wrapper" aria-hidden="true">
                            <img className="profile-pfp no-drag" src={pfp} alt="" />
                        </div>
                        <div className="profile-identity">
                            <span className="profile-name">{user?.username}</span>
                            <span className="profile-handle">@{user?.username}</span>
                        </div>
                        <div
                            className="profile-edit"
                            role="button"
                            tabIndex={0}
                            onClick={openEdit}
                            onKeyDown={handleEditKeydown}
                        >
                            Edit Profile
                        </div>
                    </section>
                    <section className="profile-bio">
                        {user?.bio ? <p className="profile-bio-text">{user.bio}</p> : null}
                        <div className="profile-stats">
                            <button type="button" className="profile-stat" onClick={() => setList("following")}>
                                <strong>{user?.following_count ?? 0}</strong> Following
                            </button>
                            <button type="button" className="profile-stat" onClick={() => setList("followers")}>
                                <strong>{user?.followers_count ?? 0}</strong> Followers
                            </button>
                            <RatingStars rating={user?.rating ?? 0} reviews={user?.rating_count ?? 0} />
                        </div>
                    </section>
                    {/* Own profile: the tabs are scoped to yourself too —
                        an unscoped Posts fetch would be the global feed. */}
                    <ProfileNav username={user?.username} />
                </div>
            </div>

            {showEdit ? <EditProfileModal onClose={() => setShowEdit(false)} /> : null}
            {list ? (
                <UserListOverlay
                    title={list === "followers" ? "Followers" : "Following"}
                    path={`/users/${user.id}/${list}`}
                    onClose={() => setList("")}
                />
            ) : null}
        </main>
    )
}

/* ============================================================================
   Another member's profile — /Profile/:username. Read-only: header, their
   posts, their portfolio/projects (no edit, no add, CVs stay owner-only).
   ============================================================================ */
function MemberProfile({ username }) {
    const navigate = useNavigate()
    const { refreshUser } = useAuth()
    const [profile, setProfile] = useState(null)
    const [error, setError] = useState("")
    const [reported, setReported] = useState(false)
    const [showReport, setShowReport] = useState(false)
    const [following, setFollowing] = useState(false)
    const [followBusy, setFollowBusy] = useState(false)
    const [list, setList] = useState("") // "followers" | "following" | ""

    useEffect(() => {
        let cancelled = false
        api(`/profile/${encodeURIComponent(username)}`)
            .then((payload) => {
                if (!cancelled) {
                    setProfile(payload?.data ?? null)
                    setReported(Boolean(payload?.data?.reported))
                    setFollowing(Boolean(payload?.data?.following))
                    setError("")
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setProfile(null)
                    setError(
                        err.status === 404
                            ? "This member does not exist."
                            : err.message || "Could not load this profile."
                    )
                }
            })
        return () => {
            cancelled = true
        }
    }, [username])

    /* Same contract as the post flag flow: `null` means the report was
       filed (the overlay closes), a string is an error shown inside it. */
    function submitReport(reason) {
        return api(`/users/${profile.id}/report`, { method: "POST", body: { reason } })
            .then(() => {
                setReported(true)
                setShowReport(false)
                return null
            })
            .catch((err) => err.message || "Could not file this report. Try again.")
    }

    /* Follow/unfollow flips one pivot row. The response carries the new
       state and the target's follower count, so the button and the stats
       move in place; the session refresh keeps the own-profile counts
       current. A failed toggle leaves everything as it was. */
    function toggleFollow() {
        if (followBusy) return
        setFollowBusy(true)
        api(`/users/${profile.id}/follow`, { method: "POST" })
            .then((payload) => {
                const data = payload?.data ?? {}
                setFollowing(Boolean(data.following))
                setProfile((prev) =>
                    prev && data.followers_count !== undefined
                        ? { ...prev, followers_count: data.followers_count }
                        : prev
                )
                return refreshUser()
            })
            .catch(() => {})
            .finally(() => setFollowBusy(false))
    }

    if (error) {
        return (
            <main className="profile-page">
                <div className="profile-container">
                    <div className="profile-content">
                        <p className="job-form-error">{error}</p>
                        <p className="messages-placeholder">
                            <Link to="/Home">Back to Home</Link>
                        </p>
                    </div>
                </div>
            </main>
        )
    }

    const pfp = profile?.avatar_url || defaultPfp
    const background = profile?.cover_url
    const backgroundType = profile?.cover_type === "video" ? "video" : "image"
    const joined = profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString(undefined, { month: "long", year: "numeric" })
        : null

    return (
        <main className="profile-page">
            {background ? (
                <ProfileBackground src={background} type={backgroundType} />
            ) : (
                <div className="profile-bg-media profile-bg-gray" aria-hidden="true" />
            )}
            <div className="profile-container">
                <div className="profile-content">
                    {/* Header/bio wait for /profile/X; the tabs below start
                        fetching right away (route param), so the profile
                        header and the tab data load in parallel. */}
                    {profile ? (
                        <>
                            <section className="profile-header">
                                <div className="profile-pfp-wrapper" aria-hidden="true">
                                    <img className="profile-pfp no-drag" src={pfp} alt="" />
                                </div>
                                <div className="profile-identity">
                                    <span className="profile-name">{profile.username}</span>
                                    <span className="profile-handle">@{profile.username}</span>
                                </div>
                                <div className="profile-actions">
                                    {reported ? (
                                        <button
                                            type="button"
                                            className="profile-icon-btn is-report is-done"
                                            disabled
                                            title="Reported"
                                            aria-label="Reported"
                                        >
                                            <IconFlag />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="profile-icon-btn is-report"
                                            onClick={() => setShowReport(true)}
                                            title="Report"
                                            aria-label="Report"
                                        >
                                            <IconFlag />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="profile-icon-btn"
                                        onClick={() => navigate(`/Messages?dm=${profile.id}`)}
                                        title="Message"
                                        aria-label="Message"
                                    >
                                        <IconMessage />
                                    </button>
                                    <button
                                        type="button"
                                        className={`profile-follow${following ? " is-following" : ""}`}
                                        onClick={toggleFollow}
                                        disabled={followBusy}
                                        title={following ? "Unfollow" : undefined}
                                    >
                                        {following ? "Following" : "Follow"}
                                    </button>
                                </div>
                            </section>
                            <section className="profile-bio">
                                {profile.bio ? <p className="profile-bio-text">{profile.bio}</p> : null}
                                <div className="profile-stats">
                                    <button type="button" className="profile-stat" onClick={() => setList("following")}>
                                        <strong>{profile.following_count ?? 0}</strong> Following
                                    </button>
                                    <button type="button" className="profile-stat" onClick={() => setList("followers")}>
                                        <strong>{profile.followers_count ?? 0}</strong> Followers
                                    </button>
                                    {joined ? <span className="profile-stat">Joined {joined}</span> : null}
                                    <RatingStars rating={profile.rating ?? 0} reviews={profile.rating_count ?? 0} />
                                </div>
                            </section>
                        </>
                    ) : (
                        <SkeletonProfileHeader />
                    )}
                    <ProfileNav username={username} readOnly />
                </div>
            </div>
            {showReport ? (
                <ReportOverlay
                    title={`Report ${profile.username}`}
                    onClose={() => setShowReport(false)}
                    onSubmit={submitReport}
                />
            ) : null}
            {list ? (
                <UserListOverlay
                    title={list === "followers" ? "Followers" : "Following"}
                    path={`/users/${profile.id}/${list}`}
                    onClose={() => setList("")}
                />
            ) : null}
        </main>
    )
}

function Profilepage() {
    const { username } = useParams()
    const { user } = useAuth()

    if (username && username !== user?.username) {
        return <MemberProfile key={username} username={username} />
    }

    return <OwnProfile />
}

export default Profilepage
