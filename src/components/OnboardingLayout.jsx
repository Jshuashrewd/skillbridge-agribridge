import { ChevronLeftIcon } from './icons'

const TOTAL_STEPS = 7

// Figma uses a different photo per onboarding step. Export each from the
// "Onboarding photo" layer inside that step's frame and save at the path
// below (see README note) — falls back to a plain overlay if missing.
const STEP_PHOTOS = {
  1: '/images/onboarding/goal.png',
  2: '/images/onboarding/interests.png',
  3: '/images/onboarding/level.png',
  4: '/images/onboarding/preferences.png',
  5: '/images/onboarding/weekly-goal.png',
  6: '/images/onboarding/plan.png',
  7: '/images/onboarding/complete.png',
}

export default function OnboardingLayout({
  step,
  leftHeadline,
  leftSubtext,
  bullets = [],
  title,
  subtitle,
  onBack,
  children,
}) {
  const progress = (step / TOTAL_STEPS) * 100

  return (
    <div className="min-h-svh bg-neutral-100 lg:flex">
      <div className="relative hidden shrink-0 flex-col justify-between overflow-hidden bg-green-900 px-2xl py-2xl text-neutral-50 lg:flex lg:w-1/2">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${STEP_PHOTOS[step]}')` }}
        />
        <div aria-hidden className="absolute inset-0 bg-[rgba(5,28,23,0.62)]" />
        <p className="relative text-h2">SkillBridge</p>
        <div className="relative max-w-[420px]">
          <p className="mb-md text-[10px] font-semibold uppercase leading-[14px] tracking-[1.2px] text-green-100">
            Step {step} of {TOTAL_STEPS}
          </p>
          <h2 className="text-h3">{leftHeadline}</h2>
          <p className="mt-sm text-body text-green-100">{leftSubtext}</p>
          <div className="mt-lg flex flex-col gap-xs">
            {bullets.map((bullet) => (
              <div
                key={bullet}
                className="flex items-center gap-sm rounded-md border border-[rgba(31,74,58,0.9)] bg-[rgba(10,42,33,0.72)] px-sm py-sm"
              >
                <span className="text-body text-green-100">✓</span>
                <span className="text-sm text-white">{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex min-h-svh w-full max-w-[480px] flex-col justify-center px-md py-xl lg:mx-0 lg:w-1/2 lg:max-w-none lg:px-2xl lg:py-2xl">
        <p className="mb-lg text-center text-h2 text-green-700 lg:hidden">SkillBridge</p>

        <div className="mx-auto w-full max-w-[400px] lg:max-w-[520px]">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="focus-ring mb-md hidden w-fit items-center gap-2xs text-sm text-neutral-600 transition-colors hover:text-neutral-950 lg:flex"
            >
              <ChevronLeftIcon className="h-4 w-4" /> Back
            </button>
          ) : null}

          <p className="mb-2xs text-[10px] font-semibold uppercase leading-[14px] tracking-[1.2px] text-green-700">
            Step {step} of {TOTAL_STEPS}
          </p>
          <div className="h-[6px] w-full rounded-full bg-[#edf2f0]">
            <div
              className="h-[6px] rounded-full bg-green-700 transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <h1 className="mt-lg text-h3 text-neutral-950">{title}</h1>
          {subtitle ? <p className="mt-2xs text-body text-neutral-600">{subtitle}</p> : null}

          <div className="mt-lg">{children}</div>
        </div>
      </div>
    </div>
  )
}
