import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Authform from '../components/authform'
import { useAuth } from '../lib/auth'

const initialForm = {
  email: '',
  username: '',
  password: '',
  confirmpassword: '',
}

function SignupPage() {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()
  const canSubmit =
    form.email.trim() !== '' &&
    form.username.trim() !== '' &&
    form.password !== '' &&
    form.confirmpassword !== ''

  function handleChange(event) {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setSubmitting(true)

    try {
      await register({
        email: form.email.trim(),
        username: form.username.trim(),
        password: form.password,
        confirmpassword: form.confirmpassword,
      })
      navigate('/Home', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Authform
      footer={
        <p>
          Already have an account? <Link to="/Login">Log in!</Link>
        </p>
      }
    >
      <p className="form-kicker">Sign Up</p>
      <h2>Welcome to Skilora</h2>

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

        {error ? <p className="job-form-error">{error}</p> : null}

        <button className="login-submit" type="submit" disabled={!canSubmit || submitting}>
          {submitting ? 'Creating…' : 'Continue'}
        </button>
      </form>
    </Authform>
  )
}

export default SignupPage
