import { formatNaira } from '../../lib/format'

export default function OrderSummaryCard({ course }) {
  const hasDiscount = Boolean(course.compareAtPrice && course.compareAtPrice > course.price)
  const discount = hasDiscount ? course.compareAtPrice - course.price : 0

  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-md">
      <h2 className="text-h1 text-neutral-950">Order summary</h2>

      <div className="mt-sm flex items-center gap-sm border-b border-neutral-200 pb-sm">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-green-100 text-caption font-semibold text-green-700">
          {course.code}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-body font-semibold text-neutral-950">{course.title}</p>
          <p className="truncate text-caption text-neutral-600">{course.instructorName}</p>
        </div>
      </div>

      <dl className="mt-sm flex flex-col gap-xs text-body">
        <div className="flex items-center justify-between">
          <dt className="text-neutral-600">Subtotal</dt>
          <dd>{formatNaira(course.compareAtPrice ?? course.price)}</dd>
        </div>
        {hasDiscount ? (
          <div className="flex items-center justify-between text-green-700">
            <dt>Discount</dt>
            <dd>-{formatNaira(discount)}</dd>
          </div>
        ) : null}
        <div className="flex items-center justify-between border-t border-neutral-200 pt-xs text-body font-semibold text-neutral-950">
          <dt>Total</dt>
          <dd>{formatNaira(course.price)}</dd>
        </div>
      </dl>
    </div>
  )
}
