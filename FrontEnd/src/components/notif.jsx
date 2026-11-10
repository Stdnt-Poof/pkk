import SettingsSection from "./settings/SettingsSection"

function Notif() {
  return (
    <SettingsSection
      title="Notification"
      subtitle="Manage the notifications you receive"
      links={[
        { to: "/Settings/Notifications/Mute", label: "Mute Notification" },
      ]}
    />
  )
}

export default Notif
