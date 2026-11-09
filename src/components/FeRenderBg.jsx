
function ProfileBackground({ src, type }) {
    if (type === "video") {
        return (
            <video
                className="profile-bg-media"
                src={src}
                autoPlay
                muted
                loop
                playsInline
            />
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