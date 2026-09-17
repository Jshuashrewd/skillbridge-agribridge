import { CATEGORIES } from '../../data/categories'

export default function SearchResultCard({ course }) {
  const isComingSoon = course.status === 'coming_soon'
  const categoryLabel = CATEGORIES.find((category) => category.key === course.category)?.label

  return (
    <div
      className={`flex items-center gap-sm rounded-lg border border-neutral-200 bg-neutral-50 p-sm ${
        isComingSoon ? 'opacity-70' : ''
      }`}
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-green-100 text-caption font-semibold text-green-700">
        {course.code}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-body font-semibold text-neutral-950">{course.title}</p>
        <p className="text-caption text-neutral-600">{categoryLabel}</p>
      </div>
      {isComingSoon ? (
        <span className="shrink-0 rounded-full bg-amber-100 px-xs py-2xs text-caption font-semibold text-amber-700">
          Coming Soon
        </span>
      ) : (
        <span className="shrink-0 rounded-full bg-green-600 px-sm py-2xs text-caption font-semibold text-white">
          Start
        </span>
      )}
    </div>
  )
}
