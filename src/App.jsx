import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomeShell from './components/HomeShell.jsx'
import SettingsPage from './pages/settingspage.jsx'
import Homepage from './pages/homepage.jsx'
import Loginpage from './pages/loginpage.jsx'
import Profilepage from './pages/profilepage.jsx'
import Teampage from './pages/teampage.jsx'
import Messagespage from './pages/messagespage.jsx'
import SignupPage from './pages/signuppage.jsx'
import Dashboard from './pages/dashboard.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Login" replace />} />
        <Route path="/Home" element={<HomeShell />}>
          <Route index element={<Homepage />} />
        </Route>
        <Route path="/Settings" element={<HomeShell />}>
          <Route index element={<SettingsPage />} />
        </Route>
        <Route path="/Messages" element={<HomeShell />} >
          <Route index element={<Messagespage />} />
        </Route>
        <Route path="/Team" element={<HomeShell />}>
          <Route index element={<Teampage />} />
        </Route>
        <Route path="/Dashboard" element={<HomeShell />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="/Profile" element={<HomeShell />}>
          <Route index element={<Profilepage />} />
        </Route>
        <Route path="/Login" element={<Loginpage />} />
        <Route path="/Signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App