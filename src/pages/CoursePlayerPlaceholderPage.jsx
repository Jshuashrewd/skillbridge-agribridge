import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { CheckCircleIcon } from '../components/icons'
import { db } from '../lib/firebase'

export default function CoursePlayerPlaceholderPage() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(undefined)

  useEffect(() => {
    let cancelled = false
    getDoc(doc(db, 'courses', courseId)).then((snap) => {
      if (!cancelled) setCourse(snap.exists() ? { id: snap.id, ...snap.data() } : null)
    })
    return () => {
      cancelled = true
    }
  }, [courseId])

  return (
    <AppShell active="discover">
      <div className="mx-auto max-w-[500px] px-md py-2xl text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white">
          <CheckCircleIcon className="h-8 w-8" />
        </span>
        <h1 className="mt-md text-h2 text-neutral-950">You're enrolled</h1>
        <p className="mt-2xs text-body text-neutral-600">
          {course?.title ? `${course.title} — ` : ''}the course player is coming in the next
          phase. For now, your enrollment is saved to your account.
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
