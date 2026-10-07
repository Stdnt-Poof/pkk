import { NavLink } from "react-router-dom";

function YourAcc() {
    return (
        <div className="settings-navigation">
            <div className="settings-header">
                <h2>Your Account</h2>
                <p>Manage information about your account, change your email, or delete your account</p>
            </div>
            <NavLink className="setting-nav-item-acc" to="/temp">Account Info</NavLink>
            <NavLink className="setting-nav-item-acc" to="/temp">Change Email</NavLink>
            <NavLink className="setting-nav-item-acc" to="/temp">Delete Your Account</NavLink>
        </div>
    )
}

export default YourAcc