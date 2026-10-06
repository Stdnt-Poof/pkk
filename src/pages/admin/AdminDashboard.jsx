import { useState } from 'react'
import './adminDashboard.css'
import AdminOverview from './AdminOverview.jsx'
import AdminUsers from './AdminUsers.jsx'
import AdminReports from './AdminReports.jsx'
import AdminPosts from './AdminPosts.jsx'
import AdminGroups from './AdminGroups.jsx'
import AdminTemplates from './AdminTemplates.jsx'
import AdminPalettes from './AdminPalettes.jsx'
import AdminAnalytics from './AdminAnalytics.jsx'
import AdminSystem from './AdminSystem.jsx'

function AdminDashboard() {
  const [tab, setTab] = useState('overview')

  return (
    <div className="adm-wrap">
      <div className="adm-title-row">
        <h1>Admin Dashboard</h1>
        <p>Static preview — no backend calls</p>
      </div>

      <div className="adm-tabs">
        <button type="button" className={tab === 'overview' ? 'adm-tab is-on' : 'adm-tab'} onClick={() => setTab('overview')}>Overview</button>
        <button type="button" className={tab === 'users' ? 'adm-tab is-on' : 'adm-tab'} onClick={() => setTab('users')}>Users</button>
        <button type="button" className={tab === 'reports' ? 'adm-tab is-on' : 'adm-tab'} onClick={() => setTab('reports')}>Reports</button>
        <button type="button" className={tab === 'posts' ? 'adm-tab is-on' : 'adm-tab'} onClick={() => setTab('posts')}>Posts</button>
        <button type="button" className={tab === 'groups' ? 'adm-tab is-on' : 'adm-tab'} onClick={() => setTab('groups')}>Groups</button>
        <button type="button" className={tab === 'templates' ? 'adm-tab is-on' : 'adm-tab'} onClick={() => setTab('templates')}>Templates</button>
        <button type="button" className={tab === 'palettes' ? 'adm-tab is-on' : 'adm-tab'} onClick={() => setTab('palettes')}>Palettes</button>
        <button type="button" className={tab === 'analytics' ? 'adm-tab is-on' : 'adm-tab'} onClick={() => setTab('analytics')}>Analytics</button>
        <button type="button" className={tab === 'system' ? 'adm-tab is-on' : 'adm-tab'} onClick={() => setTab('system')}>System</button>
      </div>

      {tab === 'overview' ? <AdminOverview /> : null}
      {tab === 'users' ? <AdminUsers /> : null}
      {tab === 'reports' ? <AdminReports /> : null}
      {tab === 'posts' ? <AdminPosts /> : null}
      {tab === 'groups' ? <AdminGroups /> : null}
      {tab === 'templates' ? <AdminTemplates /> : null}
      {tab === 'palettes' ? <AdminPalettes /> : null}
      {tab === 'analytics' ? <AdminAnalytics /> : null}
      {tab === 'system' ? <AdminSystem /> : null}
    </div>
  )
}

export default AdminDashboard
