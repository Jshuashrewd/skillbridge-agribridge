import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { useToast } from '../context/ToastContext'

const inputClass =
  'rounded-sm border border-neutral-200 bg-neutral-50 px-sm py-sm text-body text-neutral-950 outline-none transition-colors hover:border-neutral-600 focus:border-green-600 focus:ring-2 focus:ring-green-600/20'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const showToast = useToast()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    if (!email.trim()) return
    setSubmitting(true)
    // No real email is sent for this prototype — any submission moves to the reset step.
    showToast(`If ${email.trim()} has an account, we've sent a reset code.`)
    navigate('/reset-password', { replace: true })
  }

  return (
    <AuthLayout
      headline="Join a global community of learners and creators"
      subtext="Gain practical skills, advance your career, or share your expertise."
      onBack={() => navigate(-1)}
      hero="recovery"
    >
      <div className="mb-lg text-center">
        <h1 className="text-h3 text-neutral-950">Forgot your password?</h1>
        <p className="mt-2xs text-body text-neutral-600">
          Enter your email address and we'll send you a 6-digit code to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-md">
        <label className="flex flex-col gap-2xs">
          <span className="text-sm text-neutral-950">Email address</span>
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

        <button
          type="submit"
          disabled={submitting}
          className="focus-ring min-h-11 rounded-md bg-green-700 py-sm text-body text-white transition-colors hover:bg-green-900 disabled:opacity-60"
        >
          {submitting ? 'Please wait…' : 'Send code'}
        </button>
      </form>

      <p className="mt-md text-center text-sm text-neutral-600">
        <Link to="/login" className="focus-ring rounded-sm font-semibold text-green-700 hover:text-green-800 hover:underline">
          Back to log in
        </Link>
      </p>
    </AuthLayout>
  )
}
