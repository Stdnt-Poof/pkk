import SettingsSub from "../../components/settings/SettingsSub"

/* BACKEND NEEDED: GET /api/users/me — values below are mock placeholders. */

const ROWS = [
  { label: "Name", value: "Shlofte" },
  { label: "Username", value: "@shlofte" },
  { label: "Email", value: "shlofte@mail.com" },
  { label: "Joined", value: "November 2025" },
]

function AccInfo() {
  return (
    <SettingsSub backTo="/Settings/YourAccount" backLabel="Your Account" title="Account Info">
      <p className="settings-note">Your account details. Edit them on your profile page.</p>
      <ul className="settings-rows">
        {ROWS.map((row) => (
          <li key={row.label}>
            <span className="settings-row-label">{row.label}</span>
            <span>{row.value}</span>
          </li>
        ))}
      </ul>
      <p className="settings-note">Mock data — these fields will come from the backend.</p>
    </SettingsSub>
  )
}

export default AccInfo
