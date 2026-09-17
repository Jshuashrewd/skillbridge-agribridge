import DiscoveryCourseCard from './DiscoveryCourseCard'

export default function CourseRow({ title, courses, onSelectCourse }) {
  if (!courses.length) return null

  return (
    <section>
      <h2 className="mb-sm text-h1 text-neutral-950">{title}</h2>
      <div className="flex gap-sm overflow-x-auto pb-2xs">
        {courses.map((course) => (
          <DiscoveryCourseCard key={course.id} course={course} onSelect={onSelectCourse} />
        ))}
      </div>
    </section>
  )
}
