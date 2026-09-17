const STEPS = [
  { key: 'create', label: 'Create account' },
  { key: 'role', label: 'Tell us' },
  { key: 'verify', label: 'Verify' },
]

export default function SignUpStepper({ current }) {
  const currentIndex = STEPS.findIndex((step) => step.key === current)

  return (
    <div className="flex flex-wrap items-center gap-xs text-caption text-neutral-600">
      {STEPS.map((step, index) => {
        const done = index < currentIndex
        const active = index === currentIndex
        return (
          <span key={step.key} className="flex items-center gap-2xs">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                done
                  ? 'border-green-600 bg-green-600 text-white'
                  : active
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-neutral-200 text-neutral-600'
              }`}
            >
              {done ? '✓' : index + 1}
            </span>
            <span className={active ? 'font-semibold text-neutral-950' : ''}>{step.label}</span>
          </span>
        )
      })}
    </div>
  )
}
