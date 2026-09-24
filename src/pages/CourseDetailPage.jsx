import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { BookmarkIcon, PlayIcon, StarIcon, UsersIcon } from '../components/icons'
import { CATEGORIES } from '../data/categories'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { db } from '../lib/firebase'
import { formatDuration, formatNaira } from '../lib/format'

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'curriculum', label: 'Curriculum' },
  { key: 'instructor', label: 'Instructor' },
  { key: 'reviews', label: 'Reviews' },
]

export default function CourseDetailPage() {
  const { courseId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const showToast = useToast()

  const [course, setCourse] = useState(undefined) // undefined = loading, null = not found
  const [lessons, setLessons] = useState([])
  const [enrolled, setEnrolled] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

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

  const categoryLabel = CATEGORIES.find((category) => category.key === course?.category)?.label

  function goToTab(tab) {
    setActiveTab(tab.key)
    if (tab.key === 'reviews') {
      showToast('Reviews are coming soon.')
      return
    }
    document.getElementById(`tab-${tab.key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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
            className="focus-ring mt-lg inline-flex min-h-11 items-center rounded-md bg-green-700 px-lg text-body text-white transition-colors hover:bg-green-900"
          >
            Back to Discover
          </Link>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell active="discover">
      <div className="mx-auto w-full max-w-6xl px-md py-md lg:px-xl lg:py-lg">
        <p className="text-caption text-neutral-600">
          <Link to="/discover" className="focus-ring rounded-sm text-green-700 hover:underline">
            Discover
          </Link>{' '}
          › {categoryLabel} › {course.title}
        </p>

        <div className="mt-sm rounded-md border border-neutral-200 bg-neutral-50 p-md lg:flex lg:items-start lg:gap-xl lg:p-lg">
          <div className="min-w-0 flex-1">
            <div className="border-b border-neutral-200 pb-lg">
              <h1 className="text-h3 text-neutral-950">{course.title}</h1>
              <p className="mt-2xs text-body text-neutral-600">{course.description}</p>

              <div className="mt-md flex flex-wrap items-center gap-md text-sm text-neutral-600">
                {course.rating ? (
                  <span className="flex items-center gap-2xs text-amber-700">
                    <StarIcon className="h-4 w-4" />
                    {course.rating}
                    {course.reviewCount ? ` (${course.reviewCount} reviews)` : ''}
                  </span>
                ) : null}
                {course.learnerCount ? (
                  <span className="flex items-center gap-2xs">
                    <UsersIcon className="h-4 w-4" />
                    {course.learnerCount.toLocaleString('en-NG')} learners
                  </span>
                ) : null}
                {course.level ? <span>{course.level}</span> : null}
              </div>
            </div>

            {course.instructorName ? (
              <div className="mt-lg flex items-center gap-sm">
                <span className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full bg-neutral-950 text-h1 text-white">
                  {course.instructorName[0]}
                </span>
                <div className="min-w-0">
                  <p className="text-h1 text-neutral-950">{course.instructorName}</p>
                  <p className="text-caption text-neutral-600">{course.instructorTitle}</p>
                </div>
              </div>
            ) : null}

            <div
              className="relative mt-lg flex h-[220px] items-center justify-center overflow-hidden rounded-md bg-cover bg-center lg:h-[284px]"
              style={{ backgroundImage: "url('/images/discovery/course-card.jpg')" }}
            >
              <div aria-hidden className="absolute inset-0 bg-green-900/30" />
              <button
                type="button"
                onClick={() => showToast('Video playback is a styled placeholder for this prototype.')}
                className="focus-ring relative flex flex-col items-center gap-xs"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-50">
                  <PlayIcon className="h-5 w-5 text-green-700" />
                </span>
                <span className="text-caption text-white">Preview this course</span>
              </button>
            </div>

            {/* Price/enroll card shows here on mobile; on desktop it moves to the sidebar */}
            <div className="lg:hidden">
              <PriceCard
                course={course}
                enrolled={enrolled}
                onEnroll={() => navigate(`/course/${courseId}/checkout`)}
                onContinue={() => navigate(`/course/${courseId}/learn`)}
              />
            </div>

            <nav className="mt-lg flex gap-lg overflow-x-auto border-b border-neutral-200" aria-label="Course sections">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => goToTab(tab)}
                  className={`focus-ring shrink-0 border-b-2 pb-sm text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-green-700 text-green-700'
                      : 'border-transparent text-neutral-600 hover:text-neutral-950'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {course.learningOutcomes?.length ? (
              <section id="tab-overview" className="mt-lg scroll-mt-lg rounded-md border border-neutral-200 bg-neutral-50 p-md">
                <h2 className="text-h2 text-neutral-950">What you'll learn</h2>
                <ul className="mt-sm grid gap-xs sm:grid-cols-2">
                  {course.learningOutcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-2xs text-sm text-neutral-600">
                      <span className="text-green-700">✓</span>
                      {outcome}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {course.description ? (
              <section className="mt-lg">
                <h2 className="text-h1 text-neutral-950">About this course</h2>
                <p className="mt-2xs text-body text-neutral-600">{course.description}</p>
              </section>
            ) : null}

            {lessons.length ? (
              <section id="tab-curriculum" className="mt-lg scroll-mt-lg">
                <h2 className="text-h1 text-neutral-950">Curriculum</h2>
                <div className="mt-sm flex flex-col gap-2xs">
                  {lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-sm rounded-md border border-neutral-200 bg-neutral-50 p-sm"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-caption text-neutral-600">
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
                      <span className="text-green-700">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {course.instructorBio ? (
              <section id="tab-instructor" className="mt-lg scroll-mt-lg">
                <h2 className="text-h1 text-neutral-950">About the instructor</h2>
                <div className="mt-sm flex items-start gap-sm rounded-md border border-neutral-200 bg-neutral-50 p-sm">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-body text-white">
                    {course.instructorName[0]}
                  </span>
                  <div className="min-w-0">
                    <p className="text-body text-neutral-950">{course.instructorName}</p>
                    <p className="text-caption text-neutral-600">{course.instructorTitle}</p>
                    <p className="mt-2xs text-body text-neutral-600">{course.instructorBio}</p>
                  </div>
                </div>
              </section>
            ) : null}
          </div>

          <div className="mt-lg hidden lg:mt-0 lg:block lg:w-[340px] lg:shrink-0">
            <div className="sticky top-24">
              <PriceCard
                course={course}
                enrolled={enrolled}
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
  const showToast = useToast()
  const hasDiscount = Boolean(course.compareAtPrice && course.compareAtPrice > course.price)
  const discountPercent = hasDiscount
    ? Math.round(((course.compareAtPrice - course.price) / course.compareAtPrice) * 100)
    : 0

  return (
    <div className="mt-lg rounded-md border border-neutral-200 bg-neutral-50 p-md lg:mt-0">
      <div
        className="h-[178px] w-full rounded-md bg-cover bg-center"
        style={{ backgroundImage: "url('/images/discovery/course-card.jpg')" }}
      />
      {enrolled ? (
        <>
          <p className="mt-md text-caption text-green-700">You're enrolled</p>
          <button
            type="button"
            onClick={onContinue}
            className="focus-ring mt-sm min-h-11 w-full rounded-md bg-green-700 text-body text-white transition-colors hover:bg-green-900"
          >
            Continue learning
          </button>
        </>
      ) : (
        <>
          <div className="mt-md flex flex-wrap items-baseline gap-x-xs gap-y-2xs">
            <span className="text-h3 text-neutral-950">{formatNaira(course.price)}</span>
            {hasDiscount ? (
              <span className="text-h1 text-red-700 line-through">{formatNaira(course.compareAtPrice)}</span>
            ) : null}
            {hasDiscount ? <span className="text-caption text-green-700">{discountPercent}% off</span> : null}
          </div>
          <button
            type="button"
            onClick={onEnroll}
            className="focus-ring mt-sm min-h-11 w-full rounded-md bg-green-700 text-body text-white transition-colors hover:bg-green-900"
          >
            Enroll now
          </button>
          <button
            type="button"
            onClick={() => showToast('Wishlist is coming soon.')}
            className="focus-ring mt-sm flex min-h-11 w-full items-center justify-center gap-2xs rounded-md border border-neutral-200 text-sm text-neutral-950 transition-colors hover:bg-neutral-100"
          >
            Add to wishlist <BookmarkIcon className="h-[18px] w-[18px]" />
          </button>
        </>
      )}
      <ul className="mt-md flex flex-col gap-sm text-caption text-neutral-600">
        <li>✓ 30-day money-back guarantee</li>
        <li>✓ Full lifetime access</li>
        <li>✓ Access on all devices</li>
        <li>✓ Certificate of completion</li>
      </ul>
    </div>
  )
}
