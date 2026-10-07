import { NavLink } from "react-router-dom";

function Language() {
    return (
        <div className="settings-navigation">
            <div className="settings-header">
                <h2>Display, and Language</h2>
                <p>Manage the app's Display and Language</p>
            </div>
            <NavLink className="setting-nav-item-acc" to="/temp">Display</NavLink>
            <NavLink className="setting-nav-item-acc" to="/temp">Language</NavLink>
        </div>
    )
}

export default Language