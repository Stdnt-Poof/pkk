import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Authform from '../components/authform'
import { useAuth } from '../lib/auth'

const initialForm = {
  identifier: '',
  password: '',
}

function LoginPage() {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const canSubmit = form.identifier.trim() !== '' && form.password !== ''

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
      await login(form.identifier.trim(), form.password)
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

        {error ? <p className="job-form-error">{error}</p> : null}

        <button className="login-submit" type="submit" disabled={!canSubmit || submitting}>
          {submitting ? 'Checking…' : 'Continue'}
        </button>
      </form>
      </Authform>
  )
}

export default LoginPage
