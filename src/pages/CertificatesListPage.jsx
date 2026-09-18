import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { AwardIcon } from '../components/icons'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { fetchLearnerCourses } from '../lib/learnerCourses'

function formatDate(timestamp) {
  const date = timestamp?.toDate ? timestamp.toDate() : null
  if (!date) return ''
  return date.toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function CertificatesListPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const showToast = useToast()
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

  const certificates = courses?.filter((course) => course.status === 'completed' && course.certificateId) ?? []

  function handleCopyLink(certId) {
    const url = `${window.location.origin}/verify/${certId}`
    navigator.clipboard
      ?.writeText(url)
      .then(
        () => showToast('Verification link copied.'),
        () => showToast('Could not copy the link.'),
      )
  }

  return (
    <AppShell active="certificates">
      <div className="mx-auto w-full max-w-5xl px-md py-md lg:px-xl lg:py-lg">
        <h1 className="text-h2 text-neutral-950">Certificates</h1>
        <p className="mt-2xs text-body text-neutral-600">
          Celebrate your achievements and keep track of what you've earned.
        </p>

        <div className="mt-lg max-w-[220px] rounded-lg border border-neutral-200 bg-neutral-50 p-md">
          <p className="text-caption font-semibold text-neutral-600">Certificates earned</p>
          <p className="mt-xs text-h2 font-bold text-neutral-950">{certificates.length}</p>
        </div>

        <section className="mt-lg">
          {courses === null ? (
            <p className="text-body text-neutral-600">Loading…</p>
          ) : certificates.length === 0 ? (
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-lg text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                <AwardIcon className="h-6 w-6" />
              </span>
              <p className="mt-md text-body text-neutral-600">
                Complete a course to earn your first certificate.
              </p>
              <button
                type="button"
                onClick={() => navigate('/learner')}
                className="focus-ring mt-md inline-flex min-h-11 items-center rounded-md bg-green-600 px-lg text-body font-semibold text-white transition-colors hover:bg-green-700"
              >
                Go to My Learning
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-sm">
              {certificates.map((course) => (
                <div
                  key={course.courseId}
                  className="flex flex-col gap-sm rounded-lg border border-neutral-200 bg-neutral-50 p-sm sm:flex-row sm:items-center"
                >
                  <div className="flex h-16 w-full shrink-0 items-center justify-center rounded-md bg-green-100 text-h2 text-green-700 sm:h-14 sm:w-24">
                    {course.courseCode}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body font-semibold text-neutral-950">
                      {course.courseTitle}
                    </p>
                    <p className="mt-2xs text-caption text-neutral-600">
                      Completed {formatDate(course.completedAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-md">
                    <button
                      type="button"
                      onClick={() => navigate(`/course/${course.courseId}/certificate`)}
                      className="focus-ring rounded-sm text-body font-semibold text-green-700 hover:underline"
                    >
                      View certificate
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(course.certificateId)}
                      className="focus-ring rounded-sm text-body font-semibold text-green-700 hover:underline"
                    >
                      Copy link
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  )
}
