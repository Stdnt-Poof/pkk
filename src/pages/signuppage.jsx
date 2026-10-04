import { useState } from 'react'
import { Link } from 'react-router-dom'
import Authform from '../components/authform'

const initialForm = {
  email: '',
  username: '',
  password: '',
  confirmpassword: '',
}

function SignupPage() {
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

    if (form.password !== form.confirmpassword) {
      setError('Passwords do not match.')
      return
    }
  }

  return (
    <Authform
      head="Stardust Nexus"
      footer={
        <p>
          Already have an account? <Link to="/Login">Log in!</Link>
        </p>
      }
    >
      <p className="form-kicker">Sign Up</p>
      <h2>Welcome To The Nexus</h2>

      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <input
            id="signup-email"
            name="email"
            type="email"
            value={form.email}
            placeholder=" "
            autoComplete="email"
            onChange={handleChange}
            required
          />
          <label htmlFor="signup-email">Email</label>
        </div>

        <div className="form-field">
          <input
            id="signup-username"
            name="username"
            type="text"
            value={form.username}
            placeholder=" "
            autoComplete="username"
            onChange={handleChange}
            required
          />
          <label htmlFor="signup-username">Username</label>
        </div>

        <div className="form-field">
          <input
            id="signup-password"
            name="password"
            type="password"
            value={form.password}
            placeholder=" "
            autoComplete="new-password"
            onChange={handleChange}
            required
          />
          <label htmlFor="signup-password">Password</label>
        </div>

        <div className="form-field">
          <input
            id="signup-confirm-password"
            name="confirmpassword"
            type="password"
            value={form.confirmpassword}
            placeholder=" "
            autoComplete="new-password"
            onChange={handleChange}
            required
          />
          <label htmlFor="signup-confirm-password">Confirm Password</label>
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

export default SignupPage