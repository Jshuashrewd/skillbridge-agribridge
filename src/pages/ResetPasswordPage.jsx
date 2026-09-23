import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { EyeIcon, EyeOffIcon } from '../components/icons'
import Stepper from '../components/Stepper'
import { useToast } from '../context/ToastContext'

const RESET_STEPS = [
  { key: 'verify', label: 'Verify' },
  { key: 'reset', label: 'Reset' },
  { key: 'done', label: 'Done' },
]

const PASSWORD_RULES = [
  { key: 'len', label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { key: 'upper', label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { key: 'lower', label: 'One lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { key: 'number', label: 'One number', test: (pw) => /\d/.test(pw) },
  { key: 'symbol', label: 'One symbol (e.g. !, @, #, $)', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
]

const inputClass =
  'rounded-sm border border-neutral-200 bg-neutral-50 px-sm py-sm text-body text-neutral-950 outline-none transition-colors hover:border-neutral-600 focus:border-green-600 focus:ring-2 focus:ring-green-600/20'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const showToast = useToast()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const passwordChecks = PASSWORD_RULES.map((rule) => ({ ...rule, met: rule.test(password) }))
  const passwordValid = passwordChecks.every((rule) => rule.met)

  function handleSubmit(event) {
    event.preventDefault()
    if (!passwordValid) return
    setSubmitting(true)
    // No real backend password change happens in this prototype.
    showToast('Your password has been reset. Please log in.')
    navigate('/login', { replace: true })
  }

  return (
    <AuthLayout
      headline="Reset and get back on track"
      subtext="Create a new password and get back to learning confidently."
      onBack={() => navigate(-1)}
      hero="recovery"
    >
      <div className="mb-lg text-center">
        <div className="mb-md flex justify-center">
          <Stepper steps={RESET_STEPS} current="reset" />
        </div>
        <h1 className="text-h3 text-neutral-950">Create a new password</h1>
        <p className="mt-2xs text-body text-neutral-600">Enter your new password below.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-md">
        <label className="flex flex-col gap-2xs">
          <span className="text-sm text-neutral-950">New password</span>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className={`${inputClass} w-full pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="focus-ring absolute inset-y-0 right-0 flex w-10 items-center justify-center text-neutral-600 hover:text-neutral-950"
            >
              {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
        </label>

        <div className="flex flex-wrap gap-x-sm gap-y-2xs text-caption">
          {passwordChecks.map((rule) => (
            <span key={rule.key} className={rule.met ? 'text-green-700' : 'text-neutral-600'}>
              {rule.met ? '✓' : '·'} {rule.label}
            </span>
          ))}
        </div>

        <button
          type="submit"
          disabled={!passwordValid || submitting}
          className="focus-ring min-h-11 rounded-md bg-green-700 py-sm text-body text-white transition-colors hover:bg-green-900 disabled:opacity-50"
        >
          {submitting ? 'Please wait…' : 'Reset Password'}
        </button>
      </form>
    </AuthLayout>
  )
}
