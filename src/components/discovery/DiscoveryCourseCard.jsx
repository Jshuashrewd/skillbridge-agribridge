import { CATEGORIES } from '../../data/categories'

export default function DiscoveryCourseCard({ course, onSelect }) {
  const isComingSoon = course.status === 'coming_soon'
  const categoryLabel = CATEGORIES.find((category) => category.key === course.category)?.label

  return (
    <button
      type="button"
      onClick={() => onSelect?.(course)}
      className={`focus-ring flex w-40 shrink-0 flex-col overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 text-left transition-colors hover:border-green-600 sm:w-44 lg:w-48 ${
        isComingSoon ? 'opacity-80' : ''
      }`}
    >
      <div className="flex h-24 items-center justify-center bg-green-100 text-h1 text-green-700">
        {course.code}
      </div>
      <div className="flex flex-1 flex-col gap-2xs p-sm">
        <p className="line-clamp-2 text-body font-semibold leading-snug text-neutral-950 break-words">
          {course.title}
        </p>
        <p className="text-caption text-neutral-600">{categoryLabel}</p>
        <div className="mt-auto pt-xs">
          {isComingSoon ? (
            <span className="inline-block rounded-full bg-amber-100 px-xs py-2xs text-caption font-semibold text-amber-700">
              Coming Soon
            </span>
          ) : (
            <span className="inline-block rounded-full bg-green-600 px-sm py-2xs text-caption font-semibold text-white">
              Start
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
