export default function Stepper({ steps, current }) {
  const currentIndex = steps.findIndex((step) => step.key === current)

  return (
    <div className="flex flex-wrap items-center gap-md text-caption text-neutral-600">
      {steps.map((step, index) => {
        const active = index === currentIndex
        return (
          <span key={step.key} className="flex items-center gap-2xs">
            {active ? (
              <span className="h-2 w-2 shrink-0 rounded-full bg-green-700" />
            ) : (
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-[9px] leading-none">
                {index + 1}
              </span>
            )}
            <span>{step.label}</span>
          </span>
        )
      })}
    </div>
  )
}
