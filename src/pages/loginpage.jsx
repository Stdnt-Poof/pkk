import { useState } from 'react'
import { Link } from 'react-router-dom'
import Authform from '../components/authform'

const initialForm = {
  identifier: '',
  password: '',
}

function LoginPage() {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!form.identifier.trim() || !form.password) {
      setError('Please enter your username/email and password.')
      return
    }

    // Backend login will be connected here later.
  }

  return (
    <Authform 
        head="Stardust Nexus"
        footer={
          <p>Dont Have an account? <Link to="/Signup">Create One!</Link></p>
        }
      >
        <p className="form-kicker">Log In</p>
        <h2>Welcome Back</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <input
            id="login-identifier"
            name="identifier"
            type="text"
            value={form.identifier}
            placeholder=" "
            autoComplete="username"
            onChange={handleChange}
            required
          />
          <label htmlFor="login-identifier">Username or Email</label>
        </div>

        <div className="form-field">
          <input
            id="login-password"
            name="password"
            type="password"
            value={form.password}
            placeholder=" "
            autoComplete="current-password"
            onChange={handleChange}
            required
          />
          <label htmlFor="login-password">Password</label>
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button className="login-submit" type="submit">
          Continue
        </button>
      </form>
      </Authform>
  )
}

export default LoginPage