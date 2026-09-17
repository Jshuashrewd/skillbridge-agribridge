import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileShell from '../components/MobileShell'
import { useAuth } from '../context/AuthContext'

function readableAuthError(error) {
  const code = error?.code ?? ''
  if (code.includes('wrong-password') || code.includes('invalid-credential')) {
    return 'Incorrect email or password.'
  }
  if (code.includes('email-already-in-use')) {
    return 'That email is already registered with a different password.'
  }
  if (code.includes('weak-password')) {
    return 'Password should be at least 6 characters.'
  }
  if (code.includes('invalid-email')) {
    return 'Please enter a valid email address.'
  }
  return 'Something went wrong. Please try again.'
}

export default function SignInPage() {
  const { user, continueWithEmail, continueAsGuest } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) navigate('/learn', { replace: true })
  }, [user, navigate])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await continueWithEmail(email.trim(), password)
      navigate('/learn', { replace: true })
    } catch (err) {
      setError(readableAuthError(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGuest() {
    setError('')
    setSubmitting(true)
    try {
      await continueAsGuest()
      navigate('/learn', { replace: true })
    } catch (err) {
      setError(readableAuthError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <MobileShell className="justify-center px-md py-2xl">
      <div className="mb-xl text-center">
        <p className="text-h2 text-green-700">SkillBridge</p>
        <h1 className="mt-lg text-h1 text-neutral-950">Welcome back</h1>
        <p className="mt-2xs text-body text-neutral-600">Sign in to continue your learning.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-md">
        <label className="flex flex-col gap-2xs">
          <span className="text-caption text-neutral-600">Email address</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="rounded-md border border-neutral-200 bg-neutral-50 px-sm py-sm text-body text-neutral-950 outline-none focus:border-green-600"
          />
        </label>

        <label className="flex flex-col gap-2xs">
          <span className="text-caption text-neutral-600">Password</span>
          <input
            type="password"
            required
            minLength={6}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="rounded-md border border-neutral-200 bg-neutral-50 px-sm py-sm text-body text-neutral-950 outline-none focus:border-green-600"
          />
        </label>

        {error ? (
          <p className="rounded-sm bg-red-100 px-sm py-xs text-caption text-red-700">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-green-600 py-sm text-body font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
        >
          {submitting ? 'Please wait…' : 'Continue'}
        </button>
      </form>

      <div className="my-lg flex items-center gap-sm text-caption text-neutral-600">
        <span className="h-px flex-1 bg-neutral-200" />
        or
        <span className="h-px flex-1 bg-neutral-200" />
      </div>

      <button
        type="button"
        onClick={handleGuest}
        disabled={submitting}
        className="rounded-md border border-neutral-200 py-sm text-body font-semibold text-neutral-950 transition-colors hover:bg-neutral-100 disabled:opacity-60"
      >
        Continue as Guest
      </button>

      <p className="mt-md text-center text-caption text-neutral-600">
        New here? Just enter an email and password above — your account is created
        automatically.
      </p>
    </MobileShell>
  )
}
