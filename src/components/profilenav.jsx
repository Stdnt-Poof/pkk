import { useState } from "react"
import PortfolioAddInline from "./portfolio/PortfolioAddInline"
import PortfolioAddModal from "./portfolio/PortfolioAddModal"
import PortfolioList from "./portfolio/PortfolioList"
import PortfolioViewer from "./portfolio/PortfolioViewer"
import { isValidExternalUrl } from "./portfolio/portfolioUtils"
import { MOCK_PORTFOLIO } from "../data/mockPortfolio"

function ProfileNav() {
    const [active, setActive] = useState('post')
    const [items] = useState(MOCK_PORTFOLIO)
    const [viewerItem, setViewerItem] = useState(null)
    const [showAdd, setShowAdd] = useState(false)
    const [linkError, setLinkError] = useState("")

    // Preview is CV-only. Portfolio rows open their link in a new tab.
    function handleOpen(item) {
        if (item.kind === "cv") {
            setLinkError("")
            setViewerItem(item)
            return
        }
        if (!isValidExternalUrl(item.externalUrl)) {
            setViewerItem(null)
            setLinkError("This portfolio link is not a valid https domain.")
            return
        }
        setLinkError("")
        window.open(item.externalUrl, "_blank", "noopener,noreferrer")
    }

    return (
        <>
            <section className="profile-navigation">
                <div className={active === 'post' ? 'profile-nav-itemActive':'profile-nav-item'} onClick={() => setActive('post')}>Post</div>
                <div className={active === 'portfolio' ? 'profile-nav-itemActive':'profile-nav-item'} onClick={() => setActive('portfolio')}>Portfolio</div>
                <div className="profile-nav-item profile-nav-add" onClick={() => setShowAdd(true)} title="Add to portfolio">+</div>
            </section>

            <div className="profile-nav-item-content">
                {active === 'post' ?
                <div className="user-posts">
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                </div> :
                <div className="users-portfolio">
                    <PortfolioAddInline />
                    {linkError ? <p className="job-form-error">{linkError}</p> : null}
                    <PortfolioList items={items} onOpen={handleOpen} />
                </div>}
            </div>

            {viewerItem ? (
                <PortfolioViewer item={viewerItem} onClose={() => setViewerItem(null)} />
            ) : null}
            {showAdd ? (
                <PortfolioAddModal onClose={() => setShowAdd(false)} />
            ) : null}
        </>
    )
}

export default ProfileNav
