import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext.jsx'
import RequireAuth from './components/requireauth.jsx'
import RedirectIfAuthed from './components/redirectifauthed.jsx'
import HomeShell from './components/HomeShell.jsx'
import SettingsPage from './pages/settingspage.jsx'
import YourAcc from './components/YourAcc.jsx'
import Secure from './components/secure.jsx'
import Privacy from './components/privacy.jsx'
import Notif from './components/notif.jsx'
import Language from './components/language.jsx'
import Homepage from './pages/homepage.jsx'
import Loginpage from './pages/loginpage.jsx'
import Profilepage from './pages/profilepage.jsx'
import Communitypage from './pages/communitypage.jsx'
import Dashboard from './pages/dashboard.jsx'
import DashAcceptances from './pages/admin/DashAcceptances.jsx'
import DashReports from './pages/admin/DashReports.jsx'
import DashCommunityPosts from './pages/admin/DashCommunityPosts.jsx'
import DashHomePosts from './pages/admin/DashHomePosts.jsx'
import Messagespage from './pages/messagespage.jsx'
import SignupPage from './pages/signuppage.jsx'
import AccInfo from './pages/settings/AccInfo.jsx'
import ChangeEmail from './pages/settings/ChangeEmail.jsx'
import DeleteAcc from './pages/settings/DeleteAcc.jsx'
import Passkey from './pages/settings/Passkey.jsx'
import Password from './pages/settings/Password.jsx'
import ProfileVisibility from './pages/settings/ProfileVisibility.jsx'
import PostsVisibility from './pages/settings/PostsVisibility.jsx'
import ChatsPrivacy from './pages/settings/ChatsPrivacy.jsx'
import MuteNotif from './pages/settings/MuteNotif.jsx'
import Appearance from './pages/settings/Appearance.jsx'
import LanguagePref from './pages/settings/LanguagePref.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/Home" replace />} />

          <Route element={<RedirectIfAuthed />}>
            <Route path="/Login" element={<Loginpage />} />
            <Route path="/Signup" element={<SignupPage />} />
          </Route>

          {/* Everything below needs a logged in account. */}
          <Route element={<RequireAuth />}>
            <Route path="/Home" element={<HomeShell />}>
              <Route index element={<Homepage />} />
            </Route>
            <Route path="/Settings" element={<HomeShell />}>
              <Route element={<SettingsPage />}>
                <Route index element={<Navigate to="/Settings/YourAccount" replace />} />
                <Route path="YourAccount" element={<YourAcc />} />
                <Route path="YourAccount/Info" element={<AccInfo />} />
                <Route path="YourAccount/Email" element={<ChangeEmail />} />
                <Route path="YourAccount/Delete" element={<DeleteAcc />} />
                <Route path="Security" element={<Secure />} />
                <Route path="Security/Passkey" element={<Passkey />} />
                <Route path="Security/Password" element={<Password />} />
                <Route path="Privacy" element={<Privacy />} />
                <Route path="Privacy/Profile" element={<ProfileVisibility />} />
                <Route path="Privacy/Posts" element={<PostsVisibility />} />
                <Route path="Privacy/Chats" element={<ChatsPrivacy />} />
                <Route path="Notifications" element={<Notif />} />
                <Route path="Notifications/Mute" element={<MuteNotif />} />
                <Route path="Display" element={<Language />} />
                <Route path="Display/Appearance" element={<Appearance />} />
                <Route path="Display/Language" element={<LanguagePref />} />
              </Route>
            </Route>
            <Route path="/Messages" element={<HomeShell />} >
              <Route index element={<Messagespage />} />
            </Route>
            <Route path="/Community" element={<HomeShell />}>
              <Route index element={<Communitypage />} />
            </Route>
            <Route path="/Team" element={<Navigate to="/Community" replace />} />
            <Route path="/Profile" element={<HomeShell />}>
              <Route index element={<Profilepage />} />
            </Route>

            {/* The dashboard and everything under it is admin only. */}
            <Route element={<RequireAuth adminOnly />}>
              <Route path="/Dashboard" element={<HomeShell />}>
                <Route index element={<Dashboard />} />
                <Route path="Acceptances" element={<DashAcceptances />} />
                <Route path="Reports" element={<DashReports />} />
                <Route path="CommunityPosts" element={<DashCommunityPosts />} />
                <Route path="HomePosts" element={<DashHomePosts />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
