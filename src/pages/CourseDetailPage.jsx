import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { CATEGORIES } from '../data/categories'
import { useAuth } from '../context/AuthContext'
import { db } from '../lib/firebase'
import { formatDuration, formatNaira } from '../lib/format'

export default function CourseDetailPage() {
  const { courseId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [course, setCourse] = useState(undefined) // undefined = loading, null = not found
  const [lessons, setLessons] = useState([])
  const [enrolled, setEnrolled] = useState(false)

  useEffect(() => {
    let cancelled = false
    getDoc(doc(db, 'courses', courseId)).then((snap) => {
      if (!cancelled) setCourse(snap.exists() ? { id: snap.id, ...snap.data() } : null)
    })
    return () => {
      cancelled = true
    }
  }, [courseId])

  useEffect(() => {
    let cancelled = false
    const lessonsQuery = query(collection(db, 'courses', courseId, 'lessons'), orderBy('order'))
    getDocs(lessonsQuery).then((snapshot) => {
      if (!cancelled) {
        setLessons(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
      }
    })
    return () => {
      cancelled = true
    }
  }, [courseId])

  useEffect(() => {
    if (!user) return undefined
    let cancelled = false
    getDoc(doc(db, 'users', user.uid, 'enrollments', courseId)).then((snap) => {
      if (!cancelled) setEnrolled(snap.exists())
    })
    return () => {
      cancelled = true
    }
  }, [user, courseId])

  const totalDuration = useMemo(
    () => lessons.reduce((sum, lesson) => sum + (lesson.durationSeconds ?? 0), 0),
    [lessons],
  )
  const categoryLabel = CATEGORIES.find((category) => category.key === course?.category)?.label

  if (course === undefined) {
    return (
      <AppShell active="discover">
        <p className="px-md py-2xl text-center text-body text-neutral-600">Loading course…</p>
      </AppShell>
    )
  }

  if (course === null || course.status !== 'published') {
    return (
      <AppShell active="discover">
        <div className="mx-auto max-w-[600px] px-md py-2xl text-center">
          <h1 className="text-h2 text-neutral-950">
            {course === null ? 'Course not found' : 'Coming soon'}
          </h1>
          <p className="mt-sm text-body text-neutral-600">
            {course === null
              ? "This course doesn't exist or may have been removed."
              : `${course.title} isn't available to enroll in yet.`}
          </p>
          <Link
            to="/discover"
            className="focus-ring mt-lg inline-flex min-h-11 items-center rounded-md bg-green-600 px-lg text-body font-semibold text-white transition-colors hover:bg-green-700"
          >
            Back to Discover
          </Link>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell active="discover">
      <div className="mx-auto w-full max-w-5xl px-md py-md lg:px-xl lg:py-lg">
        <p className="text-caption text-neutral-600">
          <Link to="/discover" className="focus-ring rounded-sm font-semibold text-green-700 hover:underline">
            Discover
          </Link>{' '}
          / {categoryLabel}
        </p>

        <div className="mt-sm lg:flex lg:items-start lg:gap-xl">
          <div className="min-w-0 flex-1">
            <h1 className="text-h2 text-neutral-950">{course.title}</h1>
            <p className="mt-2xs text-body text-neutral-600">{course.description}</p>
            <p className="mt-sm text-caption text-neutral-600">
              {categoryLabel} · {lessons.length} lesson{lessons.length === 1 ? '' : 's'}
              {totalDuration ? ` · ${formatDuration(totalDuration)}` : ''}
            </p>

            <div className="mt-lg flex h-40 items-center justify-center rounded-lg bg-green-100 text-h2 text-green-700">
              {course.code}
            </div>

            {/* Price/enroll card shows here on mobile; on desktop it moves to the sidebar */}
            <div className="lg:hidden">
              <PriceCard
                course={course}
                enrolled={enrolled}
                signedIn={Boolean(user)}
                onEnroll={() => navigate(`/course/${courseId}/checkout`)}
                onContinue={() => navigate(`/course/${courseId}/learn`)}
              />
            </div>

            {course.learningOutcomes?.length ? (
              <section className="mt-lg">
                <h2 className="text-h1 text-neutral-950">What you'll learn</h2>
                <ul className="mt-sm grid gap-xs sm:grid-cols-2">
                  {course.learningOutcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-2xs text-body text-neutral-950">
                      <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-100 text-caption text-green-700">
                        ✓
                      </span>
                      {outcome}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {lessons.length ? (
              <section className="mt-lg">
                <h2 className="text-h1 text-neutral-950">Course content</h2>
                <div className="mt-sm flex flex-col gap-2xs">
                  {lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-sm rounded-lg border border-neutral-200 bg-neutral-50 p-sm"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-caption font-semibold text-neutral-600">
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-body text-neutral-950">
                        {lesson.title}
                      </span>
                      <span className="shrink-0 text-caption text-neutral-600">
                        {formatDuration(lesson.durationSeconds ?? 0)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {course.includes?.length ? (
              <section className="mt-lg">
                <h2 className="text-h1 text-neutral-950">This course includes</h2>
                <ul className="mt-sm grid gap-xs sm:grid-cols-2">
                  {course.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2xs text-body text-neutral-950">
                      <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-100 text-caption text-green-700">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {course.instructorName ? (
              <section className="mt-lg">
                <h2 className="text-h1 text-neutral-950">About the instructor</h2>
                <div className="mt-sm flex items-start gap-sm rounded-lg border border-neutral-200 bg-neutral-50 p-sm">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-body font-semibold text-white">
                    {course.instructorName[0]}
                  </span>
                  <div className="min-w-0">
                    <p className="text-body font-semibold text-neutral-950">{course.instructorName}</p>
                    <p className="text-caption text-neutral-600">{course.instructorTitle}</p>
                    {course.instructorBio ? (
                      <p className="mt-2xs text-body text-neutral-600">{course.instructorBio}</p>
                    ) : null}
                  </div>
                </div>
              </section>
            ) : null}
          </div>

          <div className="mt-lg hidden lg:mt-0 lg:block lg:w-80 lg:shrink-0">
            <div className="sticky top-24">
              <PriceCard
                course={course}
                enrolled={enrolled}
                signedIn={Boolean(user)}
                onEnroll={() => navigate(`/course/${courseId}/checkout`)}
                onContinue={() => navigate(`/course/${courseId}/learn`)}
              />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function PriceCard({ course, enrolled, onEnroll, onContinue }) {
  const hasDiscount = Boolean(course.compareAtPrice && course.compareAtPrice > course.price)
  const discountPercent = hasDiscount
    ? Math.round(((course.compareAtPrice - course.price) / course.compareAtPrice) * 100)
    : 0

  return (
    <div className="mt-lg rounded-lg border border-neutral-200 bg-neutral-50 p-md lg:mt-0">
      {enrolled ? (
        <>
          <p className="text-caption font-semibold text-green-700">You're enrolled</p>
          <button
            type="button"
            onClick={onContinue}
            className="focus-ring mt-sm min-h-11 w-full rounded-md bg-green-600 text-body font-semibold text-white transition-colors hover:bg-green-700"
          >
            Continue learning
          </button>
        </>
      ) : (
        <>
          <div className="flex items-baseline gap-xs">
            <span className="text-h2 font-bold text-neutral-950">{formatNaira(course.price)}</span>
            {hasDiscount ? (
              <span className="text-body text-neutral-600 line-through">
                {formatNaira(course.compareAtPrice)}
              </span>
            ) : null}
          </div>
          {hasDiscount ? (
            <p className="mt-2xs text-caption text-green-700">{discountPercent}% off</p>
          ) : null}
          <button
            type="button"
            onClick={onEnroll}
            className="focus-ring mt-sm min-h-11 w-full rounded-md bg-green-600 text-body font-semibold text-white transition-colors hover:bg-green-700"
          >
            Enroll now
          </button>
          <p className="mt-sm text-center text-caption text-neutral-600">
            Instant access after enrollment
          </p>
        </>
      )}
    </div>
  )
}
