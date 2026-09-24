import { useNavigate } from 'react-router-dom'
import { BookIcon, ClockIcon, GraduationCapIcon, PlayIcon, XCircleIcon } from '../icons'
import { formatDuration } from '../../lib/format'
import { slugifyInstructor } from '../../lib/instructor'

export default function CoursePreviewModal({ course, lessons, onClose }) {
  const navigate = useNavigate()
  const previewLessons = lessons.slice(0, 5)
  const totalSeconds = lessons.reduce((sum, lesson) => sum + (lesson.durationSeconds ?? 0), 0)

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-md"
      role="dialog"
      aria-modal="true"
      aria-label={`Preview ${course.title}`}
    >
      <button type="button" aria-label="Close preview" onClick={onClose} className="absolute inset-0 bg-neutral-950/60" />

      <div className="relative flex max-h-[90vh] w-full max-w-[1000px] flex-col overflow-y-auto rounded-lg bg-neutral-50 shadow-lg lg:flex-row lg:overflow-hidden">
        <div className="relative flex min-h-[260px] flex-1 flex-col justify-end gap-md overflow-hidden bg-green-900 p-md lg:p-lg">
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/discovery/course-card.jpg')" }}
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-green-900/0 to-green-900/90" />

          {course.instructorName ? (
            <div className="relative flex items-center gap-sm rounded-md border border-white/40 bg-white/10 p-sm backdrop-blur-sm">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-50 text-body font-semibold text-green-700">
                {course.instructorName[0]}
              </span>
              <div className="min-w-0">
                <p className="truncate text-h1 text-white">{course.instructorName}</p>
                <p className="truncate text-caption text-green-100">
                  {[
                    course.learnerCount ? `${course.learnerCount.toLocaleString('en-NG')} learners` : null,
                    course.rating ? `${course.rating} ★` : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={onClose}
            aria-label="Play preview"
            className="focus-ring absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-50"
          >
            <PlayIcon className="h-5 w-5 text-green-700" />
          </button>
        </div>

        <div className="relative flex w-full flex-col gap-sm p-md lg:w-[380px] lg:overflow-y-auto lg:p-lg">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="focus-ring absolute right-md top-md text-neutral-600 hover:text-neutral-950"
          >
            <XCircleIcon className="h-6 w-6" />
          </button>

          <p className="text-caption font-semibold text-green-700">Preview</p>
          <h2 className="text-h2 text-neutral-950">{course.title}</h2>
          <p className="text-sm text-neutral-600">{course.description}</p>

          <div className="flex flex-wrap items-center gap-md text-sm text-neutral-600">
            {course.level ? (
              <span className="flex items-center gap-2xs">
                <GraduationCapIcon className="h-4 w-4" />
                {course.level}
              </span>
            ) : null}
            {totalSeconds ? (
              <span className="flex items-center gap-2xs">
                <ClockIcon className="h-4 w-4" />
                {formatDuration(totalSeconds)}
              </span>
            ) : null}
            {lessons.length ? (
              <span className="flex items-center gap-2xs">
                <BookIcon className="h-4 w-4" />
                {lessons.length} lessons
              </span>
            ) : null}
          </div>

          <div className="h-px bg-neutral-200" />

          <p className="text-h1 text-neutral-950">Lesson preview</p>
          <div className="flex flex-col gap-2xs">
            {previewLessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`flex h-10 items-center gap-xs rounded-sm px-sm text-sm ${
                  index === 0 ? 'bg-green-100 text-green-700' : 'text-neutral-950'
                }`}
              >
                {index === 0 ? <PlayIcon className="h-4 w-4 shrink-0" /> : <span className="shrink-0 text-green-700">▷</span>}
                <span className="min-w-0 flex-1 truncate">
                  {index + 1}. {lesson.title}
                </span>
                <span className="shrink-0 text-caption text-neutral-600">{formatDuration(lesson.durationSeconds ?? 0)}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              onClose()
              document.getElementById('tab-curriculum')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            className="focus-ring text-left text-sm text-green-700 hover:underline"
          >
            View full curriculum →
          </button>

          <button
            type="button"
            onClick={() => navigate(`/course/${course.id}/checkout`)}
            className="focus-ring mt-xs min-h-12 w-full rounded-md bg-green-700 text-body text-white transition-colors hover:bg-green-800"
          >
            Enroll now
          </button>

          {course.instructorName ? (
            <button
              type="button"
              onClick={() => {
                onClose()
                navigate(`/instructor/${slugifyInstructor(course.instructorName)}?course=${course.id}`)
              }}
              className="focus-ring text-left text-caption text-neutral-600 hover:text-green-700 hover:underline"
            >
              About the instructor →
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
