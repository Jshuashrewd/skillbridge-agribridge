import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../context/AuthContext'

function readableAuthError(error) {
  const code = error?.code ?? ''
  if (code.includes('wrong-password') || code.includes('invalid-credential')) {
    return 'Incorrect email or password.'
  }
  if (code.includes('user-not-found')) return 'No account found with that email.'
  if (code.includes('invalid-email')) return 'Please enter a valid email address.'
  if (code.includes('popup-closed-by-user')) return ''
  return 'Something went wrong. Please try again.'
}

const inputClass =
  'rounded-md border border-neutral-200 bg-neutral-50 px-sm py-sm text-body text-neutral-950 outline-none transition-colors hover:border-neutral-600 focus:border-green-600 focus:ring-2 focus:ring-green-600/20'

export default function LoginPage() {
  const { user, logIn, continueWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) navigate('/discover', { replace: true })
  }, [user, navigate])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await logIn(email.trim(), password)
      navigate('/discover', { replace: true })
    } catch (err) {
      setError(readableAuthError(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setSubmitting(true)
    try {
      const { role } = await continueWithGoogle()
      navigate(role ? '/discover' : '/signup', { replace: true })
    } catch (err) {
      const message = readableAuthError(err)
      if (message) setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      headline="Same passion. Bigger possibilities."
      subtext="Log in to continue your learning journey or manage your courses."
    >
      <div className="mb-lg text-center">
        <h1 className="text-h2 text-neutral-950">Welcome back!</h1>
        <p className="mt-2xs text-body text-neutral-600">Log in to your account.</p>
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={submitting}
        className="focus-ring flex min-h-11 w-full items-center justify-center gap-2xs rounded-md border border-green-600 py-sm text-body font-semibold text-green-700 transition-colors hover:bg-green-100 disabled:opacity-60"
      >
        <span className="font-bold">G</span> Continue with Google
      </button>

      <div className="my-md flex items-center gap-sm text-caption text-neutral-600">
        <span className="h-px flex-1 bg-neutral-200" />
        or
        <span className="h-px flex-1 bg-neutral-200" />
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
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-2xs">
          <span className="text-caption text-neutral-600">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className={inputClass}
          />
        </label>

        {error ? (
          <p className="rounded-sm bg-red-100 px-sm py-xs text-caption text-red-700">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="focus-ring min-h-11 rounded-md bg-green-600 py-sm text-body font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
        >
          {submitting ? 'Please wait…' : 'Log in'}
        </button>
      </form>

      <p className="mt-md text-center text-caption text-neutral-600">
        Don't have an account?{' '}
        <Link
          to="/signup"
          className="focus-ring rounded-sm font-semibold text-green-700 hover:text-green-800 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}
