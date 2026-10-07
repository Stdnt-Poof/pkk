import { NavLink } from "react-router-dom";

function Privacy() {
    return (
        <div className="settings-navigation">
            <div className="settings-header">
                <h2>Privacy and Safety</h2>
                <p>Manage Accounts Privacy, Content that you see, or What people can view your post and Profile</p>
            </div>
            <NavLink className="setting-nav-item-acc" to="/temp">Who can see your profile</NavLink>
            <NavLink className="setting-nav-item-acc" to="/temp">Your Post</NavLink>
            <NavLink className="setting-nav-item-acc" to="/temp">Chats</NavLink>
            <NavLink className="setting-nav-item-acc" to="/temp">Content you see</NavLink>
        </div>
    )
}

export default Privacy