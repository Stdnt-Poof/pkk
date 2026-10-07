import { NavLink } from "react-router-dom";

function Secure() {
    return (
        <div className="settings-navigation">
            <div className="settings-header">
                <h2>Account Security</h2>
                <p>Manage your accounts security</p>
            </div>
            <NavLink className="setting-nav-item-acc" to="/temp">Manage Passkey</NavLink>
            <NavLink className="setting-nav-item-acc" to="/temp">Change Password</NavLink>
        </div>
    )
}

export default Secure