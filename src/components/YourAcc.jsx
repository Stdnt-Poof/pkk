import { NavLink } from "react-router-dom";

function YourAcc() {
    return (
        <div className="settings-navigation">
            <div className="settings-header">
                <h2>Your Account</h2>
                <p>Manage information about your account, change your password, or delete your account</p>
            </div>
            <NavLink className="setting-nav-item-acc" to="/temp">Account Info</NavLink>
        </div>
    )
}

export default YourAcc