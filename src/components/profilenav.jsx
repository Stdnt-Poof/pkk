import { useState } from "react"
import PortfolioAddModal from "./portfolio/PortfolioAddModal"
import PortfolioList from "./portfolio/PortfolioList"
import PortfolioViewer from "./portfolio/PortfolioViewer"
import { MOCK_PORTFOLIO } from "../data/mockPortfolio"

function ProfileNav() {
    const [active, setActive] = useState('post')
    const [items, setItems] = useState(MOCK_PORTFOLIO)
    const [viewerItem, setViewerItem] = useState(null)
    const [showAdd, setShowAdd] = useState(false)

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
                    <PortfolioList items={items} onOpen={setViewerItem} />
                </div>}
            </div>

            {viewerItem ? (
                <PortfolioViewer item={viewerItem} onClose={() => setViewerItem(null)} />
            ) : null}
            {showAdd ? (
                <PortfolioAddModal
                    onClose={() => setShowAdd(false)}
                    onAdd={(item) => {
                        setItems((prev) => [item, ...prev])
                        setShowAdd(false)
                        setActive('portfolio')
                    }}
                />
            ) : null}
        </>
    )
}

export default ProfileNav
