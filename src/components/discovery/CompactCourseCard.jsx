export default function CompactCourseCard({ course, onSelect }) {
  const isComingSoon = course.status === 'coming_soon'

  return (
    <button
      type="button"
      onClick={() => onSelect?.(course)}
      className="focus-ring flex w-full items-center gap-sm rounded-md bg-neutral-50 p-2xs text-left"
    >
      <div
        className="h-[96px] w-[132px] shrink-0 rounded-sm bg-cover bg-center"
        style={{ backgroundImage: "url('/images/discovery/course-card-clean.jpg')" }}
      />
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm leading-tight text-neutral-950">{course.title}</p>
        {course.instructorName ? (
          <p className="mt-2xs truncate text-caption text-neutral-600">{course.instructorName}</p>
        ) : null}
        <p className="mt-2xs text-caption text-amber-700">
          {isComingSoon ? 'Coming soon' : `★ ${course.rating ?? '—'} · ${course.level ?? 'Beginner'}`}
        </p>
      </div>
    </button>
  )
}
