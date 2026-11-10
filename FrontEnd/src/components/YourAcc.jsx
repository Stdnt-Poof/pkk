import SettingsSection from "./settings/SettingsSection"

function YourAcc() {
  return (
    <SettingsSection
      title="Your Account"
      subtitle="Manage information about your account, change your email, or delete your account"
      links={[
        { to: "/Settings/YourAccount/Info", label: "Account Info" },
        { to: "/Settings/YourAccount/Email", label: "Change Email" },
        { to: "/Settings/YourAccount/Delete", label: "Delete Your Account" },
      ]}
    />
  )
}

export default YourAcc
