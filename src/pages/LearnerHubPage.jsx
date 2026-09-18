import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import ToolkitsSection from '../components/learner/ToolkitsSection'
import { useAuth } from '../context/AuthContext'
import { formatDuration } from '../lib/format'
import { fetchLearnerCourses } from '../lib/learnerCourses'

export default function LearnerHubPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState(null) // null = loading

  useEffect(() => {
    if (!user) return undefined
    let cancelled = false
    fetchLearnerCourses(user.uid).then((result) => {
      if (!cancelled) setCourses(result)
    })
    return () => {
      cancelled = true
    }
  }, [user])

  const inProgress = courses?.filter((course) => course.status !== 'completed') ?? []
  const completedCount = courses?.filter((course) => course.status === 'completed').length ?? 0

  return (
    <AppShell active="learning">
      <div className="mx-auto w-full max-w-5xl px-md py-md lg:px-xl lg:py-lg">
        <h1 className="text-h2 text-neutral-950">My Learning</h1>
        <p className="mt-2xs text-body text-neutral-600">
          Access your enrolled courses and continue where you left off.
        </p>

        <div className="mt-lg grid grid-cols-2 gap-sm sm:max-w-[420px]">
          <StatTile
            label="Courses in progress"
            value={inProgress.length}
            caption="Keep going this week"
          />
          <StatTile
            label="Courses completed"
            value={completedCount}
            caption="Across your learning"
          />
        </div>

        <section className="mt-lg">
          <h2 className="text-h1 text-neutral-950">Continue learning</h2>
          {courses === null ? (
            <p className="mt-sm text-body text-neutral-600">Loading…</p>
          ) : inProgress.length === 0 && courses.length === 0 ? (
            <EmptyState
              message="You haven't enrolled in a course yet."
              actionLabel="Browse courses"
              onAction={() => navigate('/discover')}
            />
          ) : inProgress.length === 0 ? (
            <EmptyState
              message="You've completed every course you're enrolled in — nice work!"
              actionLabel="Browse more courses"
              onAction={() => navigate('/discover')}
            />
          ) : (
            <div className="mt-sm flex flex-col gap-sm">
              {inProgress.map((course) => (
                <LearningRow key={course.courseId} course={course} />
              ))}
            </div>
          )}
        </section>

        <ToolkitsSection />
      </div>
    </AppShell>
  )
}

function StatTile({ label, value, caption }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-md">
      <p className="text-caption font-semibold text-neutral-600">{label}</p>
      <p className="mt-xs text-h2 font-bold text-neutral-950">{value}</p>
      <p className="mt-2xs text-caption text-neutral-600">{caption}</p>
    </div>
  )
}

function EmptyState({ message, actionLabel, onAction }) {
  return (
    <div className="mt-sm rounded-lg border border-neutral-200 bg-neutral-50 p-lg text-center">
      <p className="text-body text-neutral-600">{message}</p>
      <button
        type="button"
        onClick={onAction}
        className="focus-ring mt-md inline-flex min-h-11 items-center rounded-md bg-green-600 px-lg text-body font-semibold text-white transition-colors hover:bg-green-700"
      >
        {actionLabel}
      </button>
    </div>
  )
}

function LearningRow({ course }) {
  const navigate = useNavigate()
  const target = course.nextLessonId
    ? `/course/${course.courseId}/learn/${course.nextLessonId}`
    : `/course/${course.courseId}/learn`

  return (
    <div className="flex flex-col gap-sm rounded-lg border border-neutral-200 bg-neutral-50 p-sm sm:flex-row sm:items-center">
      <div className="flex h-16 w-full shrink-0 items-center justify-center rounded-md bg-green-100 text-h2 text-green-700 sm:h-14 sm:w-24">
        {course.courseCode}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-body font-semibold text-neutral-950">{course.courseTitle}</p>
        {course.nextLessonTitle ? (
          <p className="mt-2xs truncate text-caption text-neutral-600">
            Lesson {course.nextLessonOrder} of {course.totalLessons} · {course.nextLessonTitle}
          </p>
        ) : null}
        <div className="mt-xs h-2 w-full overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full rounded-full bg-green-600 transition-all"
            style={{ width: `${course.percent}%` }}
          />
        </div>
        <p className="mt-2xs text-caption text-green-700">
          {course.percent}% complete
          {course.remainingSeconds ? ` · ${formatDuration(course.remainingSeconds)} left` : ''}
        </p>
      </div>
      <button
        type="button"
        onClick={() => navigate(target)}
        className="focus-ring shrink-0 rounded-md bg-green-600 px-lg py-sm text-body font-semibold text-white transition-colors hover:bg-green-700 sm:self-center"
      >
        Continue
      </button>
    </div>
  )
}
