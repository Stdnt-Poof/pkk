import SettingsSection from "./settings/SettingsSection"

function Secure() {
  return (
    <SettingsSection
      title="Account Security"
      subtitle="Manage your account's security"
      links={[
        { to: "/Settings/Security/Passkey", label: "Manage Passkey" },
        { to: "/Settings/Security/Password", label: "Change Password" },
      ]}
    />
  )
}

export default Secure
