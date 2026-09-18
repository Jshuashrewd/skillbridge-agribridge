export default function QuizProgressCard({ passed, total }) {
  const percent = total ? Math.round((passed / total) * 100) : 0

  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-md">
      <h2 className="text-h1 text-neutral-950">Quiz progress</h2>
      <p className="mt-2xs text-caption text-neutral-600">
        {passed} of {total} question{total === 1 ? '' : 's'}
      </p>
      <div className="mt-sm h-2 w-full overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full rounded-full bg-green-600 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-xs text-caption text-neutral-600">{percent}% complete</p>
      <p className="mt-md text-caption text-neutral-600">
        Wrong answers can be retried right away — no penalty.
      </p>
    </div>
  )
}
