import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import DiscoveryCourseCard from '../components/discovery/DiscoveryCourseCard'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { db } from '../lib/firebase'
import { formatDuration } from '../lib/format'
import { fetchLearnerCourses } from '../lib/learnerCourses'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function MetricCard({ label, value, caption }) {
  return (
    <div className="flex flex-1 flex-col gap-sm rounded-md border border-neutral-200 bg-neutral-50 p-md">
      <p className="text-[10px] font-semibold uppercase leading-[14px] tracking-[1.2px] text-neutral-600">
        {label}
      </p>
      <p className="text-[34px] font-bold leading-[42px] text-neutral-950">{value}</p>
      <p className="text-caption text-neutral-600">{caption}</p>
    </div>
  )
}

export default function HomePage() {
  const { user } = useAuth()
  const showToast = useToast()
  const navigate = useNavigate()
  const [learnerCourses, setLearnerCourses] = useState(null) // null = loading
  const [catalog, setCatalog] = useState([])

  useEffect(() => {
    if (!user) return undefined
    let cancelled = false
    fetchLearnerCourses(user.uid).then((result) => {
      if (!cancelled) setLearnerCourses(result)
    })
    return () => {
      cancelled = true
    }
  }, [user])

  useEffect(() => {
    const coursesQuery = query(collection(db, 'courses'), orderBy('order'))
    return onSnapshot(coursesQuery, (snapshot) => {
      setCatalog(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
    })
  }, [])

  const inProgress = learnerCourses?.filter((course) => course.status !== 'completed') ?? []
  const completedCount = learnerCourses?.filter((course) => course.status === 'completed').length ?? 0
  const certificatesCount = learnerCourses?.filter((course) => course.certificateId).length ?? 0
  const continueCourse = inProgress[0] ?? null

  const recommended = useMemo(() => {
    const enrolledIds = new Set((learnerCourses ?? []).map((course) => course.courseId))
    return catalog.filter((course) => !enrolledIds.has(course.id)).slice(0, 3)
  }, [catalog, learnerCourses])

  function handleSelectCourse(course) {
    if (course.status === 'coming_soon') {
      showToast(`${course.title} is coming soon.`)
    } else {
      navigate(`/course/${course.id}`)
    }
  }

  const firstName = user?.displayName?.split(' ')[0] ?? 'Learner'

  return (
    <AppShell active="home">
      <div className="mx-auto w-full max-w-5xl px-md py-md lg:px-lg lg:py-lg">
        <h1 className="text-h1 text-neutral-950">
          {greeting()}, {firstName} 👋
        </h1>
        <p className="mt-2xs text-sm text-neutral-600">Keep learning. You're making great progress.</p>

        <div className="mt-lg grid grid-cols-2 gap-sm lg:max-w-[640px] lg:grid-cols-3">
          <MetricCard label="In progress" value={inProgress.length} caption="Keep going this week" />
          <MetricCard label="Completed" value={completedCount} caption="Across your learning" />
          <MetricCard label="Certificates" value={certificatesCount} caption="Achievements earned" />
        </div>

        <section className="mt-lg">
          <h2 className="text-h1 text-neutral-950">Continue learning</h2>
          {learnerCourses === null ? (
            <p className="mt-sm text-body text-neutral-600">Loading…</p>
          ) : continueCourse ? (
            <button
              type="button"
              onClick={() =>
                navigate(
                  continueCourse.nextLessonId
                    ? `/course/${continueCourse.courseId}/learn/${continueCourse.nextLessonId}`
                    : `/course/${continueCourse.courseId}/learn`,
                )
              }
              className="focus-ring mt-sm flex w-full flex-col items-start gap-sm rounded-md border border-neutral-200 bg-neutral-50 p-sm text-left sm:flex-row sm:items-center"
            >
              <div
                className="h-[96px] w-full shrink-0 rounded-sm bg-cover bg-center sm:w-[148px]"
                style={{ backgroundImage: "url('/images/discovery/course-card-clean.jpg')" }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-body font-medium text-neutral-950">{continueCourse.courseTitle}</p>
                {continueCourse.nextLessonTitle ? (
                  <p className="mt-2xs truncate text-caption text-neutral-600">
                    Lesson {continueCourse.nextLessonOrder} of {continueCourse.totalLessons} ·{' '}
                    {continueCourse.nextLessonTitle}
                  </p>
                ) : null}
                <div className="mt-xs h-[6px] w-full max-w-[250px] overflow-hidden rounded-full bg-neutral-200">
                  <div
                    className="h-full rounded-full bg-green-700 transition-all"
                    style={{ width: `${continueCourse.percent}%` }}
                  />
                </div>
                <p className="mt-2xs text-caption">
                  <span className="text-green-700">{continueCourse.percent}% complete</span>
                  {continueCourse.remainingSeconds ? (
                    <span className="text-neutral-600"> · {formatDuration(continueCourse.remainingSeconds)} left</span>
                  ) : null}
                </p>
              </div>
            </button>
          ) : (
            <div className="mt-sm rounded-md border border-neutral-200 bg-neutral-50 p-lg text-center">
              <p className="text-body text-neutral-600">You haven't started a course yet.</p>
              <button
                type="button"
                onClick={() => navigate('/discover')}
                className="focus-ring mt-md inline-flex min-h-11 items-center rounded-md bg-green-600 px-lg text-body font-semibold text-white transition-colors hover:bg-green-700"
              >
                Browse courses
              </button>
            </div>
          )}
        </section>

        {recommended.length ? (
          <section className="mt-lg pb-lg">
            <h2 className="text-h1 text-neutral-950">Recommended for you</h2>
            <div className="mt-sm flex flex-wrap gap-sm">
              {recommended.map((course) => (
                <DiscoveryCourseCard key={course.id} course={course} onSelect={handleSelectCourse} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </AppShell>
  )
}
