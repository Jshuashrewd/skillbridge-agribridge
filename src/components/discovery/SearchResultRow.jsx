import { BookmarkIcon, StarIcon } from '../icons'
import { formatNaira } from '../../lib/format'

function learnerCountLabel(count) {
  if (!count) return null
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k learners`
  return `${count} learners`
}

export default function SearchResultRow({ course, onSelect }) {
  const isComingSoon = course.status === 'coming_soon'
  const learnerLabel = learnerCountLabel(course.learnerCount)

  return (
    <button
      type="button"
      onClick={() => onSelect?.(course)}
      className="focus-ring flex w-full items-center gap-sm rounded-md border border-neutral-200 bg-neutral-50 p-2xs text-left transition-colors hover:border-green-600 sm:gap-md sm:p-sm"
    >
      <div
        className="h-20 w-20 shrink-0 rounded-sm bg-cover bg-center sm:h-[100px] sm:w-[154px]"
        style={{ backgroundImage: "url('/images/discovery/course-card-clean.jpg')" }}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-neutral-950 sm:text-h1">{course.title}</p>
        <p className="mt-2xs truncate text-caption text-neutral-600">{course.instructorName ?? 'SkillBridge'}</p>
        <p className="mt-2xs flex flex-wrap items-center gap-2xs text-caption text-amber-700">
          {course.rating ? (
            <span className="flex items-center gap-2xs">
              <StarIcon className="h-[14px] w-[14px]" />
              {course.rating}
            </span>
          ) : null}
          {learnerLabel ? <span className="text-neutral-600">· {learnerLabel}</span> : null}
        </p>
      </div>
      <div className="flex h-20 shrink-0 flex-col items-end justify-between sm:h-[100px]">
        <p className="whitespace-nowrap text-sm text-green-700 sm:text-h1">
          {isComingSoon ? '—' : course.price ? formatNaira(course.price) : 'Free'}
        </p>
        <BookmarkIcon className="h-5 w-5 text-neutral-600" />
      </div>
    </button>
  )
}
