import { Outlet } from "react-router-dom"
import SettingsNav from "../components/settingsnav"

function SettingsPage() {

  return (
    <div className="page-layout settings-page-layout">
      <SettingsNav />

      <Outlet />
    </div>
  )
}

export default SettingsPage