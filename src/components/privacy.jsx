import SettingsSection from "./settings/SettingsSection"

function Privacy() {
  return (
    <SettingsSection
      title="Privacy and Safety"
      subtitle="Manage your account's privacy, and what people can see on your profile and posts"
      links={[
        { to: "/Settings/Privacy/Profile", label: "Who can see your profile" },
        { to: "/Settings/Privacy/Posts", label: "Your Posts" },
        { to: "/Settings/Privacy/Chats", label: "Chats" },
      ]}
    />
  )
}

export default Privacy
