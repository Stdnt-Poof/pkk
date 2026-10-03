import { useState } from "react"

function ProfileNav() {
    const [active, setActive] = useState('post')

    return (
        <>
            <section className="profile-navigation">
                <div className={active === 'post' ? 'profile-nav-itemActive':'profile-nav-item'} onClick={() => setActive('post')}>Post</div>
                <div className={active === 'design' ? 'profile-nav-itemActive':'profile-nav-item'} onClick={() => setActive('design')}>Designs</div>
                <div className={active === 'likeddesign' ? 'profile-nav-itemActive':'profile-nav-item'} onClick={() => setActive('likeddesign')}>Liked Designs</div>
            </section>

            <div className="profile-nav-item-content">
                {active === 'post' ? 
                <div className="user-posts">
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                    <div>help</div>
                </div> : active === 'design' ? 
                <div className="users-designs">
                    pls
                </div> : active === 'likeddesign' ? 
                <div className="users-likeddesigns">
                    no
                </div> : <h1>yamete</h1>}
            </div> 
        </>
    )


}

export default ProfileNav