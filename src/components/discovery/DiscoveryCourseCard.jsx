import { BookmarkIcon, StarIcon, UsersIcon } from '../icons'
import { formatNaira } from '../../lib/format'

function learnerCountLabel(count) {
  if (!count) return null
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k learners`
  return `${count} learners`
}

export default function DiscoveryCourseCard({ course, onSelect }) {
  const isComingSoon = course.status === 'coming_soon'
  const learnerLabel = learnerCountLabel(course.learnerCount)

  return (
    <button
      type="button"
      onClick={() => onSelect?.(course)}
      className="focus-ring flex w-[220px] shrink-0 flex-col overflow-hidden rounded-md bg-neutral-50 text-left transition-opacity hover:opacity-90 sm:w-[250px] lg:w-[270px]"
    >
      <div
        className="relative flex h-[140px] items-end justify-end rounded-sm bg-cover bg-center p-xs"
        style={{ backgroundImage: "url('/images/discovery/course-card.jpg')" }}
      >
        {isComingSoon ? (
          <span className="rounded-sm bg-amber-100 px-xs py-2xs text-caption font-semibold text-amber-700">
            Coming soon
          </span>
        ) : (
          <span className="rounded-sm bg-green-600 px-xs py-2xs text-caption text-white">4h 20m</span>
        )}
      </div>
      <div className="flex flex-col gap-sm py-sm">
        <div>
          <p className="truncate text-[16px] font-medium text-neutral-950">{course.title}</p>
          <p className="truncate text-caption text-neutral-600">{course.instructorName ?? 'SkillBridge'}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-sm">
            {course.rating ? (
              <span className="flex items-center gap-2xs text-caption text-amber-700">
                <StarIcon className="h-[14px] w-[14px]" />
                {course.rating}
              </span>
            ) : null}
            {learnerLabel ? (
              <span className="flex items-center gap-2xs text-caption text-neutral-600">
                <UsersIcon className="h-[14px] w-[14px]" />
                {learnerLabel}
              </span>
            ) : null}
          </div>
          <BookmarkIcon className="h-5 w-5 text-neutral-600" />
        </div>
        {course.price ? (
          <p className="text-[18px] font-medium text-green-700">{formatNaira(course.price)}</p>
        ) : null}
      </div>
    </button>
  )
}
