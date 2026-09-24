import { StarIcon } from '../icons'

export default function TrendingCourseCard({ course, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(course)}
      className="focus-ring flex w-full min-w-0 items-center gap-sm rounded-md border border-neutral-200 bg-neutral-50 p-xs text-left transition-colors hover:border-green-600"
    >
      <div
        className="h-[72px] w-[96px] shrink-0 rounded-sm bg-cover bg-center"
        style={{ backgroundImage: "url('/images/discovery/trending-card.jpg')" }}
      />
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm leading-tight text-neutral-950">{course.title}</p>
        {course.instructorName ? (
          <p className="truncate text-caption font-bold text-neutral-950">by {course.instructorName}</p>
        ) : null}
        {course.rating ? (
          <span className="mt-2xs flex items-center gap-2xs text-caption text-amber-700">
            <StarIcon className="h-[14px] w-[14px]" />
            {course.rating}
          </span>
        ) : null}
      </div>
    </button>
  )
}
