import { NavLink } from "react-router-dom";

function Notif() {
    return (
        <div className="settings-navigation">
            <div className="settings-header">
                <h2>Notification</h2>
                <p>Manage the Notifications you recive</p>
            </div>
            <NavLink className="setting-nav-item-acc" to="/temp">Mute Notification</NavLink>
        </div>
    )
}

export default Notif