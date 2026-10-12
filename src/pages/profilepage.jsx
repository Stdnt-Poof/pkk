import ProfileBackground from "../components/FeRenderBg"
import ProfileNav from "../components/profilenav"
import RatingStars from "../components/RatingStars"
import bgtemp from "../assets/bgtemp.jpg"
import temp from "../assets/temp.jpg"

function Profilepage() {
    const background = {
        src: bgtemp,
        type: "image"
    }

    return (
        <main className="profile-page">
            <ProfileBackground {...background} />
            <div className="profile-container">
                <div className="profile-content">
                    <section className="profile-header">
                        <div className="profile-pfp-wrapper" aria-hidden="true">
                            <img className="profile-pfp no-drag" src={temp} alt="" />
                        </div>
                        <div className="profile-identity">
                            <span className="profile-name">Shlofte</span>
                            <span className="profile-handle">@shlofte</span>
                        </div>
                        <div className="profile-edit" role="button" tabIndex={0}>Edit Profile</div>
                    </section>
                    <section className="profile-bio">
                        <p className="profile-bio-text">He has been reborn, ジョイボーイ</p>
                        <div className="profile-stats">
                            <span className="profile-stat"><strong>0</strong> Following</span>
                            <span className="profile-stat"><strong>0</strong> Followers</span>
                            <RatingStars rating={4.8} reviews={12} />
                        </div>
                    </section>
                    <ProfileNav />
                </div>
            </div>
        </main>
    )
}

export default Profilepage