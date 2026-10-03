
function ProfileBackground({ src, type }) {
    if (type === "video") {
        return (
            <video
                className="profile-bg-media"
                autoPlay
                muted
                loop
                playsInline
            >
                <source src={src} type="video/webm" />
                <source src={src} type="video/mp4" />
            </video>
        )
    }

    return (
        <img
            className="profile-bg-media no-drag"
            src={src}
            alt=""
        />
    )
}

export default ProfileBackground