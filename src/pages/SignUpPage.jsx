import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { CheckCircleIcon, CloseIcon, EyeIcon, EyeOffIcon } from '../components/icons'
import RoleCard from '../components/RoleCard'
import Stepper from '../components/Stepper'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const SIGNUP_STEPS = [
  { key: 'create', label: 'Create account' },
  { key: 'role', label: 'Tell us' },
  { key: 'verify', label: 'Verify' },
]

const PASSWORD_RULES = [
  { key: 'len', label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { key: 'upper', label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { key: 'lower', label: 'One lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { key: 'number', label: 'One number', test: (pw) => /\d/.test(pw) },
  { key: 'symbol', label: 'One symbol (e.g. !, @, #, $)', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
]

const STEP_CONTENT = {
  create: {
    headline: 'Join a global community of learners and creators',
    subtext: 'Gain practical skills, advance your career, or share your expertise.',
  },
  role: {
    headline: 'Your path starts here',
    subtext: "Tell SkillBridge what you want to do so we can shape the right experience for you.",
  },
  verify: {
    headline: 'One quick step',
    subtext: 'Verify your email to secure your SkillBridge account and unlock course access.',
  },
}

const RESEND_SECONDS = 45

const inputClass =
  'rounded-sm border border-neutral-200 bg-neutral-50 px-sm py-sm text-body text-neutral-950 outline-none transition-colors hover:border-neutral-600 focus:border-green-600 focus:ring-2 focus:ring-green-600/20'

function readableAuthError(error) {
  const code = error?.code ?? ''
  if (code.includes('email-already-in-use')) return 'That email is already registered.'
  if (code.includes('weak-password')) return 'Password should be at least 6 characters.'
  if (code.includes('invalid-email')) return 'Please enter a valid email address.'
  if (code.includes('popup-closed-by-user')) return ''
  return 'Something went wrong. Please try again.'
}

export default function SignUpPage() {
  const { user, signUp, continueWithGoogle, setUserRole } = useAuth()
  const navigate = useNavigate()
  const showToast = useToast()

  const [step, setStep] = useState('create')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('learner')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [resendSeconds, setResendSeconds] = useState(RESEND_SECONDS)

  const passwordChecks = PASSWORD_RULES.map((rule) => ({ ...rule, met: rule.test(password) }))
  const passwordValid = passwordChecks.every((rule) => rule.met)
  const createValid = firstName.trim() && lastName.trim() && email.trim() && passwordValid

  useEffect(() => {
    if (step !== 'verify' || resendSeconds <= 0) return
    const timer = setInterval(() => setResendSeconds((seconds) => seconds - 1), 1000)
    return () => clearInterval(timer)
  }, [step, resendSeconds])

  async function handleCreateAccount(event) {
    event.preventDefault()
    if (!createValid) return
    setError('')
    setSubmitting(true)
    try {
      await signUp(email.trim(), password, { firstName: firstName.trim(), lastName: lastName.trim() })
      setStep('role')
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
      const { role: existingRole } = await continueWithGoogle()
      if (existingRole) {
        navigate('/discover', { replace: true })
      } else {
        setStep('role')
      }
    } catch (err) {
      const message = readableAuthError(err)
      if (message) setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRoleContinue() {
    if (role === 'tutor') {
      showToast('Tutor accounts are coming soon — continue as a Learner for now.')
      return
    }
    setSubmitting(true)
    try {
      await setUserRole('learner')
      setStep('verify')
    } catch {
      setError('Could not save your selection. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleVerify() {
    // No real email is sent for this prototype — any click completes verification.
    setShowSuccessModal(true)
  }

  function goToDashboard() {
    navigate('/discover', { replace: true })
  }

  return (
    <AuthLayout headline={STEP_CONTENT[step].headline} subtext={STEP_CONTENT[step].subtext}>
      <Stepper steps={SIGNUP_STEPS} current={step} />

      {step === 'create' ? (
        <>
          <div className="mt-lg mb-lg">
            <h1 className="text-h3 text-neutral-950">Create your account</h1>
            <p className="mt-2xs text-body text-neutral-600">Get started with SkillBridge today.</p>
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={submitting}
            className="focus-ring flex min-h-11 w-full items-center justify-center gap-2xs rounded-md border border-green-700 py-sm text-body text-green-700 transition-colors hover:bg-green-100 disabled:opacity-60"
          >
            <span className="font-bold">G</span> Continue with Google
          </button>

          <p className="my-md text-center text-sm text-neutral-600">— or sign up with email —</p>

          <form onSubmit={handleCreateAccount} className="flex flex-col gap-md">
            <div className="flex flex-col gap-md sm:flex-row sm:gap-sm">
              <label className="flex min-w-0 flex-1 flex-col gap-2xs">
                <span className="text-sm text-neutral-950">First name</span>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="e.g. John"
                  className={`${inputClass} w-full`}
                />
              </label>
              <label className="flex min-w-0 flex-1 flex-col gap-2xs">
                <span className="text-sm text-neutral-950">Last name</span>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="e.g. Doe"
                  className={`${inputClass} w-full`}
                />
              </label>
            </div>

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

            <label className="flex flex-col gap-2xs">
              <span className="text-sm text-neutral-950">Password</span>
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

            {error ? (
              <p className="rounded-sm bg-red-100 px-sm py-xs text-caption text-red-700">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={!createValid || submitting}
              className="focus-ring min-h-11 rounded-md bg-green-700 py-sm text-body text-white transition-colors hover:bg-green-900 disabled:opacity-50"
            >
              {submitting ? 'Please wait…' : 'Create account'}
            </button>
          </form>

          <p className="mt-md text-center text-sm text-neutral-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="focus-ring rounded-sm font-semibold text-green-700 hover:text-green-800 hover:underline"
            >
              Log in
            </Link>
          </p>
        </>
      ) : null}

      {step === 'role' ? (
        <>
          <div className="mt-lg mb-lg">
            <h1 className="text-h3 text-neutral-950">Tell us about you</h1>
            <p className="mt-2xs text-body text-neutral-600">What brings you to SkillBridge?</p>
          </div>

          <div className="flex flex-col gap-sm">
            <RoleCard
              icon="L"
              title="I'm a Learner"
              description="I want to learn new skills, take courses, and grow my career."
              selected={role === 'learner'}
              onSelect={() => setRole('learner')}
            />
            <RoleCard
              icon="T"
              title="I'm a Tutor"
              description="I want to create courses, share my knowledge, and earn income."
              selected={role === 'tutor'}
              onSelect={() => setRole('tutor')}
            />
          </div>

          {error ? (
            <p className="mt-md rounded-sm bg-red-100 px-sm py-xs text-caption text-red-700">{error}</p>
          ) : null}

          <button
            type="button"
            onClick={handleRoleContinue}
            disabled={submitting}
            className="focus-ring mt-lg min-h-11 w-full rounded-md bg-green-700 py-sm text-body text-white transition-colors hover:bg-green-900 disabled:opacity-60"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={() => setStep('create')}
            className="focus-ring mt-sm flex min-h-11 w-full items-center justify-center rounded-md text-sm text-green-700 transition-colors hover:bg-green-100"
          >
            Back
          </button>
        </>
      ) : null}

      {step === 'verify' ? (
        <>
          <div className="mt-lg mb-lg">
            <h1 className="text-h3 text-neutral-950">Verify your email</h1>
            <p className="mt-2xs text-body text-neutral-600">
              We've sent a 6-digit code to {user?.email ?? 'your email'}
            </p>
          </div>

          <div className="flex justify-between gap-xs">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                aria-label={`Verification code digit ${index + 1}`}
                className="h-[52px] w-[52px] rounded-sm border border-neutral-200 bg-neutral-50 text-center text-h1 text-neutral-950 outline-none transition-colors hover:border-neutral-600 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
              />
            ))}
          </div>

          <p className="mt-sm text-center text-sm text-neutral-600">
            Didn't receive the code?{' '}
            {resendSeconds > 0 ? (
              <span>Resend code ({String(Math.floor(resendSeconds / 60)).padStart(2, '0')}:{String(resendSeconds % 60).padStart(2, '0')})</span>
            ) : (
              <button
                type="button"
                onClick={() => setResendSeconds(RESEND_SECONDS)}
                className="focus-ring rounded-sm font-semibold text-green-700 hover:underline"
              >
                Resend code
              </button>
            )}
          </p>

          <p className="mt-lg rounded-md bg-green-100 px-sm py-sm text-sm text-neutral-600">
            Verifying your email helps keep your account secure and is required to take courses.
          </p>

          <button
            type="button"
            onClick={handleVerify}
            className="focus-ring mt-lg min-h-11 w-full rounded-md bg-green-700 py-sm text-body text-white transition-colors hover:bg-green-900"
          >
            Verify email
          </button>
        </>
      ) : null}

      {showSuccessModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#202522]/68 px-md">
          <div className="w-full max-w-[400px] rounded-lg bg-white p-lg shadow-xl">
            <div className="flex items-start justify-between">
              <CheckCircleIcon className="h-12 w-12 text-green-700" />
              <button
                type="button"
                onClick={goToDashboard}
                aria-label="Close"
                className="focus-ring rounded-sm text-neutral-600 hover:text-neutral-950"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <h2 className="mt-md text-[18px] font-medium text-neutral-950">Account created successfully!</h2>
            <p className="mt-2xs text-sm text-neutral-600">
              Your SkillBridge account is ready. Continue to your dashboard to start setting up your learning
              experience.
            </p>
            <button
              type="button"
              onClick={goToDashboard}
              className="focus-ring mt-lg min-h-11 w-full rounded-md bg-green-700 py-sm text-body text-white transition-colors hover:bg-green-900"
            >
              Go to dashboard
            </button>
          </div>
        </div>
      ) : null}
    </AuthLayout>
  )
}
