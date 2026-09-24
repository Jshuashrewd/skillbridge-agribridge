import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { GlobeIcon, LinkIcon, StarIcon } from '../components/icons'
import { useToast } from '../context/ToastContext'
import { db } from '../lib/firebase'
import { instructorSlugMatches } from '../lib/instructor'

// No review system exists yet — the star-rating breakdown below is
// illustrative, matching the Figma mock, until real per-course reviews are
// collected. The overall rating and total count are real, from the course.
const RATING_BREAKDOWN = [
  { stars: 5, percent: 68 },
  { stars: 4, percent: 24 },
  { stars: 3, percent: 6 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 1 },
]

const SAMPLE_REVIEWS = [
  {
    name: 'James Adeyemi',
    when: '1 month ago',
    body: 'Excellent course! The instructor explains complex concepts in a simple way. The exercises and downloadable resources were super helpful.',
  },
  {
    name: 'Priya Sharma',
    when: '2 months ago',
    body: 'Great content and very well structured. I enjoyed the case studies and practical examples.',
  },
  {
    name: 'Michael Chen',
    when: '2 months ago',
    body: 'Very practical and engaging. The projects helped me apply what I learned immediately.',
  },
]

export default function InstructorProfilePage() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const showToast = useToast()
  const [catalog, setCatalog] = useState(null) // null = loading

  useEffect(() => {
    const coursesQuery = query(collection(db, 'courses'), orderBy('order'))
    return onSnapshot(coursesQuery, (snapshot) => {
      setCatalog(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
    })
  }, [])

  useEffect(() => {
    if (catalog !== null && location.hash === '#reviews') {
      document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [catalog, location.hash])

  if (catalog === null) {
    return (
      <AppShell active="discover">
        <p className="px-md py-2xl text-center text-body text-neutral-600">Loading instructor…</p>
      </AppShell>
    )
  }

  const instructorCourses = catalog.filter(
    (course) => course.instructorName && instructorSlugMatches(course.instructorName, slug),
  )
  const primaryCourse =
    instructorCourses.find((course) => course.id === searchParams.get('course')) ?? instructorCourses[0]

  if (!primaryCourse) {
    return (
      <AppShell active="discover">
        <div className="mx-auto max-w-[600px] px-md py-2xl text-center">
          <h1 className="text-h2 text-neutral-950">Instructor not found</h1>
          <p className="mt-sm text-body text-neutral-600">This instructor doesn't have a profile yet.</p>
        </div>
      </AppShell>
    )
  }

  const totalLearners = instructorCourses.reduce((sum, course) => sum + (course.learnerCount ?? 0), 0)

  return (
    <AppShell active="discover">
      <div className="mx-auto w-full max-w-6xl px-md py-md lg:px-lg lg:py-lg">
        <div className="relative flex h-[140px] flex-col justify-center overflow-hidden rounded-lg bg-green-900 px-md text-neutral-50 lg:h-[152px] lg:px-lg">
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/discovery/hero.jpg')" }}
          />
          <div aria-hidden className="absolute inset-0 bg-green-900/55" />
          <div className="relative">
            <h1 className="text-h2 leading-tight lg:text-h3">Knowledge creates opportunity</h1>
            <p className="mt-2xs text-caption text-green-100">Design · Build · Teach · Empower</p>
          </div>
        </div>

        <div className="-mt-lg relative mx-md flex flex-col gap-lg rounded-md border border-neutral-200 bg-neutral-50 p-md lg:mx-0 lg:flex-row lg:items-center lg:justify-between lg:p-lg">
          <div className="flex flex-col gap-lg lg:flex-row lg:items-center">
            <div
              className="h-[110px] w-[110px] shrink-0 self-start rounded-lg bg-cover bg-center lg:h-[140px] lg:w-[140px]"
              style={{ backgroundImage: "url('/images/discovery/course-card-clean.jpg')" }}
            />
            <div className="flex flex-col gap-lg">
              <div>
                <h2 className="text-h3 text-neutral-950">{primaryCourse.instructorName}</h2>
                <p className="mt-2xs text-body text-neutral-600">{primaryCourse.instructorTitle}</p>
              </div>
              <div className="flex flex-wrap gap-xl">
                {primaryCourse.rating ? (
                  <div>
                    <p className="text-h2 font-semibold text-amber-700">★ {primaryCourse.rating}</p>
                    <p className="text-caption text-neutral-600">{primaryCourse.reviewCount ?? 0} reviews</p>
                  </div>
                ) : null}
                {totalLearners ? (
                  <div>
                    <p className="text-h2 text-neutral-950">{(totalLearners / 1000).toFixed(1)}k</p>
                    <p className="text-caption text-neutral-600">Total learners</p>
                  </div>
                ) : null}
                <div>
                  <p className="text-h2 text-neutral-950">{instructorCourses.length}</p>
                  <p className="text-caption text-neutral-600">Course{instructorCourses.length === 1 ? '' : 's'}</p>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => showToast('Following instructors is coming soon.')}
            className="focus-ring min-h-12 shrink-0 rounded-md bg-green-700 px-xl text-body text-white transition-colors hover:bg-green-800"
          >
            Follow
          </button>
        </div>

        <div className="mt-lg rounded-md border border-neutral-200 bg-neutral-50 p-md lg:p-lg">
          <div className="flex flex-col gap-lg lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-h2 text-neutral-950">About {primaryCourse.instructorName?.split(' ')[0]}</h2>
              <p className="mt-sm text-body text-neutral-600">{primaryCourse.instructorBio}</p>
              <div className="mt-md flex flex-wrap gap-lg text-caption text-neutral-950">
                <span className="flex items-center gap-2xs">
                  <GlobeIcon className="h-4 w-4" />
                  Teaches Worldwide
                </span>
                <button
                  type="button"
                  onClick={() => showToast('Instructor social links are coming soon.')}
                  className="focus-ring flex items-center gap-2xs hover:text-green-700"
                >
                  <LinkIcon className="h-4 w-4" />
                  LinkedIn Profile
                </button>
              </div>
            </div>
            <div className="rounded-md bg-green-100 p-md lg:w-[380px]">
              <p className="text-body font-medium text-green-900">
                "Design has the power to create opportunities and change lives. I teach to help others build the
                future they want."
              </p>
            </div>
          </div>
        </div>

        {instructorCourses.length ? (
          <section className="mt-lg rounded-md border border-neutral-200 bg-neutral-50 p-md lg:p-lg">
            <h2 className="text-h2 text-neutral-950">Courses</h2>
            <div className="mt-sm flex flex-col gap-sm sm:flex-row sm:flex-wrap">
              {instructorCourses.map((course) => (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => (course.status === 'coming_soon' ? showToast(`${course.title} is coming soon.`) : navigate(`/course/${course.id}`))}
                  className="focus-ring flex w-full items-center gap-sm rounded-md text-left sm:w-[340px]"
                >
                  <div
                    className="h-[82px] w-[118px] shrink-0 rounded-sm bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/discovery/course-card-clean.jpg')" }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-neutral-950">{course.title}</p>
                    <p className="mt-2xs text-caption text-amber-700">
                      {course.rating ? `★ ${course.rating}` : 'Coming soon'}
                      {course.level ? ` · ${course.level}` : ''}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        <section id="reviews" className="mt-lg scroll-mt-lg rounded-md border border-neutral-200 bg-neutral-50 p-md lg:p-lg">
          <h2 className="text-h3 text-neutral-950">Reviews & Ratings</h2>
          <p className="mt-2xs text-body text-neutral-600">
            See what learners are saying. Real feedback from a global community of students.
          </p>

          <div className="mt-md flex flex-col gap-lg rounded-md border border-neutral-200 bg-white p-md sm:flex-row sm:items-center">
            <div className="shrink-0">
              <p className="text-caption text-neutral-600">Overall rating</p>
              <p className="text-h4 text-neutral-950">{primaryCourse.rating ?? '—'}</p>
              <p className="text-h2 text-amber-500">★★★★★</p>
              <p className="text-caption text-neutral-600">{primaryCourse.reviewCount ?? 0} total reviews</p>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-xs">
              {RATING_BREAKDOWN.map((row) => (
                <div key={row.stars} className="flex items-center gap-sm text-caption text-neutral-600">
                  <span className="w-10 shrink-0">{row.stars} star</span>
                  <div className="h-[10px] flex-1 overflow-hidden rounded-full bg-neutral-200">
                    <div className="h-full rounded-full bg-green-700" style={{ width: `${row.percent}%` }} />
                  </div>
                  <span className="w-8 shrink-0 text-right">{row.percent}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-md flex flex-col gap-sm">
            {SAMPLE_REVIEWS.map((review) => (
              <div key={review.name} className="flex gap-sm rounded-md border border-neutral-200 bg-white p-sm">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-body text-white">
                  {review.name[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-neutral-950">{review.name}</p>
                  <p className="text-caption text-neutral-600">{review.when}</p>
                  <p className="mt-2xs flex items-center gap-2xs text-caption text-amber-700">
                    <StarIcon className="h-[14px] w-[14px]" />
                    5.0
                  </p>
                  <p className="mt-xs text-sm text-neutral-600">{review.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  )
}
