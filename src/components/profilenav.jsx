import { useCallback, useEffect, useState } from "react"
import api from "../lib/api"
import PortfolioAddModal from "./portfolio/PortfolioAddModal"
import PortfolioList from "./portfolio/PortfolioList"
import PortfolioViewer from "./portfolio/PortfolioViewer"
import ProjectAddModal from "./portfolio/ProjectAddModal"
import { isValidExternalUrl, isValidProjectUrl } from "./portfolio/portfolioUtils"
import { SkeletonPortfolioList } from "./skeleton"
import { IconGrid, IconList } from "./icons"
import PostFeed from "./PostFeed"

/**
 * Tabs under a profile header: Post / Portfolio / Projects.
 *
 * `username` scopes the tab data to that member (their posts + ?user= items).
 * `readOnly` (another member's profile) hides the Add buttons and keeps CVs
 * owner-only — the API nulls file_url for everyone else.
 */
function ProfileNav({ username, readOnly = false }) {
    const [active, setActive] = useState('post')
    const [view, setView] = useState("list")
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [listError, setListError] = useState("")
    const [viewerItem, setViewerItem] = useState(null)
    const [showAdd, setShowAdd] = useState(false)
    const [showProjectAdd, setShowProjectAdd] = useState(false)
    const [linkError, setLinkError] = useState("")

    const portfolioItems = items.filter((item) => item.kind === "portfolio" || item.kind === "cv")
    const projectItems = items.filter((item) => item.kind === "project")

    const fetchItems = useCallback(
        () => (username ? api(`/portfolios?user=${encodeURIComponent(username)}`) : api('/portfolios')),
        [username]
    )

    const loadItems = useCallback(async () => {
        try {
            const payload = await fetchItems()
            setItems(payload?.data ?? [])
            setListError("")
        } catch (error) {
            setListError(error.message || "Could not load the portfolio.")
        } finally {
            setLoading(false)
        }
    }, [fetchItems])

    useEffect(() => {
        let active = true

        fetchItems()
            .then((payload) => {
                if (active) setItems(payload?.data ?? [])
            })
            .catch((error) => {
                if (active) setListError(error.message || "Could not load the portfolio.")
            })
            .finally(() => {
                if (active) setLoading(false)
            })

        return () => {
            active = false
        }
    }, [fetchItems])

    // CVs open the PDF preview; links open in a new tab. On a read-only
    // profile the API hides the CV file, so show a note instead of a viewer.
    function handleOpen(item) {
        if (item.kind === "cv") {
            if (readOnly && !item.file_url) {
                setViewerItem(null)
                setLinkError("Only the owner can open this file.")
                return
            }
            setLinkError("")
            setViewerItem(item)
            return
        }

        const valid = item.kind === "project"
            ? isValidProjectUrl(item.external_url)
            : isValidExternalUrl(item.external_url)

        if (!valid) {
            setViewerItem(null)
            setLinkError("This link is not a valid https domain.")
            return
        }

        setLinkError("")
        window.open(item.external_url, "_blank", "noopener,noreferrer")
    }

    function handleCreated() {
        setShowAdd(false)
        setShowProjectAdd(false)
        loadItems()
    }

    /* Layout switch for the portfolio/project tabs: list rows (preview
       on the left — the original look) or a card grid with the preview
       on top. A viewer preference, so it shows on every profile. */
    const viewToggle = (
        <div className="pf-view-toggle" role="group" aria-label="Layout">
            <button
                type="button"
                className={view === "list" ? "pf-view-btn is-active" : "pf-view-btn"}
                aria-pressed={view === "list"}
                title="List view"
                onClick={() => setView("list")}
            >
                <IconList />
                <span className="sr-only">List view</span>
            </button>
            <button
                type="button"
                className={view === "grid" ? "pf-view-btn is-active" : "pf-view-btn"}
                aria-pressed={view === "grid"}
                title="Grid view"
                onClick={() => setView("grid")}
            >
                <IconGrid />
                <span className="sr-only">Grid view</span>
            </button>
        </div>
    )

    function renderList(listItems, emptyText) {
        if (loading) {
            return <SkeletonPortfolioList />
        }

        if (listError) {
            return <p className="job-form-error">{listError}</p>
        }

        return <PortfolioList items={listItems} onOpen={handleOpen} emptyText={emptyText} view={view} />
    }

    return (
        <>
            <section className="profile-navigation">
                <div className={active === 'post' ? 'profile-nav-itemActive':'profile-nav-item'} onClick={() => setActive('post')}>Post</div>
                <div className={active === 'portfolio' ? 'profile-nav-itemActive':'profile-nav-item'} onClick={() => setActive('portfolio')}>Portfolio</div>
                <div className={active === 'projects' ? 'profile-nav-itemActive':'profile-nav-item'} onClick={() => setActive('projects')}>Projects</div>
            </section>

            <div className="profile-nav-item-content">
                {active === 'post' ?
                <div className="user-posts">
                    <PostFeed
                        key={username ?? "me"}
                        user={username}
                    />
                </div> :
                active === 'portfolio' ?
                <div className="users-portfolio">
                    {readOnly ? null : (
                        <button type="button" className="pf-add-open" onClick={() => setShowAdd(true)}>
                            <span aria-hidden="true">+</span>
                            Add to portfolio
                        </button>
                    )}
                    {linkError ? <p className="job-form-error">{linkError}</p> : null}
                    {viewToggle}
                    {renderList(portfolioItems, readOnly ? "No portfolio items yet." : "No portfolio items yet — add a link or upload your CV.")}
                </div> :
                <div className="users-portfolio">
                    {readOnly ? null : (
                        <button type="button" className="pf-add-open" onClick={() => setShowProjectAdd(true)}>
                            <span aria-hidden="true">+</span>
                            Add project
                        </button>
                    )}
                    {linkError ? <p className="job-form-error">{linkError}</p> : null}
                    {viewToggle}
                    {renderList(projectItems, readOnly ? "No projects yet." : "No projects yet — add a GitHub or GitLab repository.")}
                </div>}
            </div>

            {viewerItem ? (
                <PortfolioViewer item={viewerItem} onClose={() => setViewerItem(null)} />
            ) : null}
            {showAdd ? (
                <PortfolioAddModal onClose={() => setShowAdd(false)} onCreated={handleCreated} />
            ) : null}
            {showProjectAdd ? (
                <ProjectAddModal onClose={() => setShowProjectAdd(false)} onCreated={handleCreated} />
            ) : null}
        </>
    )
}

export default ProfileNav
