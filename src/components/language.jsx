import SettingsSection from "./settings/SettingsSection"

function Language() {
  return (
    <SettingsSection
      title="Display, and Language"
      subtitle="Manage the app's display and language"
      links={[
        { to: "/Settings/Display/Appearance", label: "Display" },
        { to: "/Settings/Display/Language", label: "Language" },
      ]}
    />
  )
}

export default Language
