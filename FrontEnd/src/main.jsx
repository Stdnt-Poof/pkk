import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Default is dark mode (:root vars). Only add `light` if user saved it.
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
