import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { CheckCircleIcon, PlayIcon } from '../components/icons'
import CurriculumSidebar from '../components/player/CurriculumSidebar'
import QuizPanel from '../components/player/QuizPanel'
import QuizProgressCard from '../components/player/QuizProgressCard'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { issueCertificate } from '../lib/certificate'
import { db } from '../lib/firebase'
import { formatDuration } from '../lib/format'
import { completeLesson, touchProgress } from '../lib/progress'

const TABS = ['Overview', 'Resources', 'Notes', 'Discussion']

export default function CoursePlayerPage() {
  const { courseId, lessonId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const showToast = useToast()

  const [course, setCourse] = useState(undefined) // undefined = loading, null = not found
  const [lessons, setLessons] = useState(null) // null = loading
  const [enrolled, setEnrolled] = useState(undefined) // undefined = checking
  const [progress, setProgress] = useState(null)
  const [mode, setMode] = useState('overview') // 'overview' | 'quiz' | 'lesson-complete'
  const [quizProgress, setQuizProgress] = useState({ passed: 0, total: 0 })

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
      if (!cancelled) setLessons(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
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

  useEffect(() => {
    if (enrolled === false) navigate(`/course/${courseId}`, { replace: true })
  }, [enrolled, courseId, navigate])

  // No lessonId in the URL yet: figure out where this learner should land.
  useEffect(() => {
    if (lessonId || !lessons || !lessons.length || !user) return undefined
    let cancelled = false
    getDoc(doc(db, 'users', user.uid, 'progress', courseId)).then((snap) => {
      if (cancelled) return
      const completedLessonIds = snap.exists() ? (snap.data().completedLessonIds ?? []) : []
      const target = lessons.find((lesson) => !completedLessonIds.includes(lesson.id)) ?? lessons[0]
      navigate(`/course/${courseId}/learn/${target.id}`, { replace: true })
    })
    return () => {
      cancelled = true
    }
  }, [lessonId, lessons, user, courseId, navigate])

  useEffect(() => {
    if (!user || !lessonId) return undefined
    let cancelled = false
    touchProgress(user.uid, courseId, lessonId).then((data) => {
      if (!cancelled) setProgress(data)
    })
    return () => {
      cancelled = true
    }
  }, [user, courseId, lessonId])

  useEffect(() => {
    setMode('overview')
    setQuizProgress({ passed: 0, total: 0 })
  }, [lessonId])

  const completedLessonIds = useMemo(() => progress?.completedLessonIds ?? [], [progress])
  const currentLesson = useMemo(
    () => lessons?.find((lesson) => lesson.id === lessonId) ?? null,
    [lessons, lessonId],
  )

  // A direct link to a lesson that hasn't been unlocked yet bounces back.
  useEffect(() => {
    if (!lessons?.length || !currentLesson || !progress) return
    const unlocked = currentLesson.order === 1 || completedLessonIds.length >= currentLesson.order - 1
    if (!unlocked) {
      const target = lessons.find((lesson) => !completedLessonIds.includes(lesson.id)) ?? lessons[0]
      showToast('That lesson isn’t unlocked yet.')
      navigate(`/course/${courseId}/learn/${target.id}`, { replace: true })
    }
  }, [lessons, currentLesson, progress, completedLessonIds, courseId, navigate, showToast])

  const totalDurationSeconds = useMemo(
    () => (lessons ?? []).reduce((sum, lesson) => sum + (lesson.durationSeconds ?? 0), 0),
    [lessons],
  )

  const currentIndex = lessons?.findIndex((lesson) => lesson.id === lessonId) ?? -1
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson =
    lessons && currentIndex >= 0 && currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : null
  const isLastLesson = lessons ? currentIndex === lessons.length - 1 : false
  const lessonIsComplete = currentLesson ? completedLessonIds.includes(currentLesson.id) : false
  const percentComplete = lessons?.length
    ? Math.round((completedLessonIds.length / lessons.length) * 100)
    : 0

  async function handleQuizPass() {
    const result = await completeLesson(user.uid, courseId, currentLesson.id, lessons.length)
    setProgress(result)
    if (result.status === 'completed') {
      await issueCertificate({
        uid: user.uid,
        userName: user.displayName ?? user.email ?? 'Learner',
        courseId,
        courseCode: course.code,
        courseTitle: course.title,
      })
      navigate(`/course/${courseId}/certificate`)
      return
    }
    setMode('lesson-complete')
  }

  if (course === undefined || lessons === null || enrolled === undefined) {
    return (
      <AppShell active="discover">
        <p className="px-md py-2xl text-center text-body text-neutral-600">Loading…</p>
      </AppShell>
    )
  }

  if (course === null || !currentLesson) {
    return (
      <AppShell active="discover">
        <div className="mx-auto max-w-[600px] px-md py-2xl text-center">
          <h1 className="text-h2 text-neutral-950">
            {course === null ? 'Course not found' : 'Loading lesson…'}
          </h1>
          {course === null ? (
            <Link
              to="/discover"
              className="focus-ring mt-lg inline-flex min-h-11 items-center rounded-md bg-green-600 px-lg text-body font-semibold text-white transition-colors hover:bg-green-700"
            >
              Back to Discover
            </Link>
          ) : null}
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell active="discover">
      <div className="mx-auto w-full max-w-6xl px-md py-md lg:px-xl lg:py-lg">
        <p className="text-caption text-neutral-600">
          <Link
            to="/discover"
            className="focus-ring rounded-sm font-semibold text-green-700 hover:underline"
          >
            Discover
          </Link>{' '}
          / {course.title}
        </p>

        <div className="mt-sm lg:flex lg:items-start lg:gap-xl">
          <div className="min-w-0 flex-1">
            {mode === 'quiz' ? (
              <QuizPanel
                questions={currentLesson.quiz?.questions ?? []}
                onPass={handleQuizPass}
                onProgress={setQuizProgress}
              />
            ) : mode === 'lesson-complete' ? (
              <LessonCompleteCard
                lesson={currentLesson}
                nextLesson={nextLesson}
                onContinue={() => nextLesson && navigate(`/course/${courseId}/learn/${nextLesson.id}`)}
              />
            ) : (
              <>
                <VideoPlaceholder
                  lesson={currentLesson}
                  onInteract={() =>
                    showToast('Video playback isn’t available in this prototype.')
                  }
                />

                <div className="mt-md flex items-start gap-sm">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-body font-semibold text-white">
                    {course.instructorName?.[0] ?? 'S'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-body font-semibold text-neutral-950">
                      {course.instructorName}
                    </p>
                    <p className="text-caption text-neutral-600">{course.instructorTitle}</p>
                  </div>
                </div>

                <div className="mt-md flex items-center justify-between gap-sm">
                  <h1 className="text-h2 text-neutral-950">{course.title}</h1>
                  <p className="shrink-0 text-caption font-semibold text-neutral-600">
                    {percentComplete}% complete
                  </p>
                </div>
                <p className="mt-2xs text-caption text-neutral-600">
                  {completedLessonIds.length} of {lessons.length} lessons completed
                </p>
                <div className="mt-xs h-2 w-full overflow-hidden rounded-full bg-neutral-200">
                  <div
                    className="h-full rounded-full bg-green-600 transition-all"
                    style={{ width: `${percentComplete}%` }}
                  />
                </div>

                <h2 className="mt-lg text-h1 text-neutral-950">
                  Lesson {currentLesson.order} · {currentLesson.title}
                </h2>

                <div className="mt-sm flex gap-lg overflow-x-auto border-b border-neutral-200">
                  {TABS.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => {
                        if (tab !== 'Overview') showToast(`${tab} is coming soon.`)
                      }}
                      className={`focus-ring -mb-px shrink-0 border-b-2 px-2xs py-sm text-body font-semibold transition-colors ${
                        tab === 'Overview'
                          ? 'border-green-600 text-green-700'
                          : 'border-transparent text-neutral-600 hover:text-neutral-950'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <p className="mt-md text-body text-neutral-950">{currentLesson.content}</p>

                {currentLesson.objectives?.length ? (
                  <ul className="mt-md flex flex-col gap-xs">
                    {currentLesson.objectives.map((objective) => (
                      <li
                        key={objective}
                        className="flex items-start gap-2xs text-body text-neutral-950"
                      >
                        <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-lg flex items-center justify-between gap-sm">
                  <button
                    type="button"
                    onClick={() =>
                      previousLesson && navigate(`/course/${courseId}/learn/${previousLesson.id}`)
                    }
                    disabled={!previousLesson}
                    className="focus-ring min-h-11 rounded-md border border-green-600 px-lg text-body font-semibold text-green-700 transition-colors hover:bg-green-100 disabled:cursor-default disabled:opacity-40"
                  >
                    Previous lesson
                  </button>

                  {lessonIsComplete ? (
                    <button
                      type="button"
                      onClick={() =>
                        isLastLesson
                          ? navigate(`/course/${courseId}/certificate`)
                          : navigate(`/course/${courseId}/learn/${nextLesson.id}`)
                      }
                      className="focus-ring min-h-11 rounded-md bg-green-600 px-lg text-body font-semibold text-white transition-colors hover:bg-green-700"
                    >
                      {isLastLesson ? 'View certificate' : 'Next lesson'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setMode('quiz')}
                      className="focus-ring min-h-11 rounded-md bg-green-600 px-lg text-body font-semibold text-white transition-colors hover:bg-green-700"
                    >
                      Take knowledge check
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="mt-lg lg:mt-0 lg:w-80 lg:shrink-0">
            <div className="sticky top-24">
              {mode === 'quiz' ? (
                <QuizProgressCard passed={quizProgress.passed} total={quizProgress.total} />
              ) : (
                <CurriculumSidebar
                  courseId={courseId}
                  lessons={lessons}
                  completedLessonIds={completedLessonIds}
                  currentLessonId={currentLesson.id}
                  totalDurationSeconds={totalDurationSeconds}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function VideoPlaceholder({ lesson, onInteract }) {
  return (
    <button
      type="button"
      onClick={onInteract}
      className="focus-ring group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-neutral-950"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-green-700 transition-colors group-hover:bg-white">
        <PlayIcon className="h-7 w-7 translate-x-0.5" />
      </span>
      <span className="absolute bottom-sm left-sm rounded-md bg-neutral-950/70 px-xs py-2xs text-caption text-white">
        {formatDuration(lesson.durationSeconds ?? 0)}
      </span>
    </button>
  )
}

function LessonCompleteCard({ lesson, nextLesson, onContinue }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-lg text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white">
        <CheckCircleIcon className="h-8 w-8" />
      </span>
      <h1 className="mt-md text-h2 text-neutral-950">Lesson complete!</h1>
      <p className="mt-2xs text-body text-neutral-600">
        You passed the knowledge check for "{lesson.title}."
      </p>
      {nextLesson ? (
        <button
          type="button"
          onClick={onContinue}
          className="focus-ring mt-lg min-h-11 rounded-md bg-green-600 px-lg text-body font-semibold text-white transition-colors hover:bg-green-700"
        >
          Continue to {nextLesson.title}
        </button>
      ) : null}
    </div>
  )
}
