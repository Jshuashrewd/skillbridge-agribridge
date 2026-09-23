import DiscoveryCourseCard from './DiscoveryCourseCard'
import TrendingCourseCard from './TrendingCourseCard'

export default function CourseRow({ title, courses, onSelectCourse, variant = 'grid', onViewAll }) {
  if (!courses.length) return null

  return (
    <section>
      <div className="mb-sm flex items-end justify-between gap-sm">
        <h2 className="text-h2 text-neutral-950">{title}</h2>
        {onViewAll ? (
          <button type="button" onClick={onViewAll} className="focus-ring shrink-0 text-sm text-green-700 hover:underline">
            View all →
          </button>
        ) : null}
      </div>
      {variant === 'trending' ? (
        <div className="grid grid-cols-1 gap-sm sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <TrendingCourseCard key={course.id} course={course} onSelect={onSelectCourse} />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-sm">
          {courses.map((course) => (
            <DiscoveryCourseCard key={course.id} course={course} onSelect={onSelectCourse} />
          ))}
        </div>
      )}
    </section>
  )
}
