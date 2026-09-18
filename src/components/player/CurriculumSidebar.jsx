import { Link } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import { formatDuration } from '../../lib/format'
import { LockIcon } from '../icons'

// Groups the flat, order-sorted lesson list by `module`, preserving the
// order modules first appear in.
function groupByModule(lessons) {
  const groups = []
  const byModule = new Map()
  for (const lesson of lessons) {
    let group = byModule.get(lesson.module)
    if (!group) {
      group = { key: lesson.module, title: lesson.module, lessons: [] }
      byModule.set(lesson.module, group)
      groups.push(group)
    }
    group.lessons.push(lesson)
  }
  return groups
}

export default function CurriculumSidebar({
  courseId,
  lessons,
  completedLessonIds,
  currentLessonId,
  totalDurationSeconds,
}) {
  const showToast = useToast()
  const modules = groupByModule(lessons)
  const completedCount = completedLessonIds.length

  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-md">
      <h2 className="text-h1 text-neutral-950">Contents</h2>
      <p className="mt-2xs text-caption text-neutral-600">
        {lessons.length} lesson{lessons.length === 1 ? '' : 's'} ·{' '}
        {formatDuration(totalDurationSeconds)}
      </p>

      <div className="mt-md flex flex-col gap-md">
        {modules.map((group, groupIndex) => (
          <div key={group.key}>
            <p className="text-caption font-semibold text-neutral-950">
              {groupIndex + 1}. {group.title}
            </p>
            <div className="mt-xs flex flex-col gap-2xs">
              {group.lessons.map((lesson) => {
                const isCompleted = completedLessonIds.includes(lesson.id)
                const isCurrent = lesson.id === currentLessonId
                const isUnlocked =
                  isCompleted || isCurrent || lesson.order <= completedCount + 1

                return (
                  <Link
                    key={lesson.id}
                    to={`/course/${courseId}/learn/${lesson.id}`}
                    onClick={(event) => {
                      if (!isUnlocked) {
                        event.preventDefault()
                        showToast('Pass the current lesson’s knowledge check to unlock this one.')
                      }
                    }}
                    aria-current={isCurrent ? 'true' : undefined}
                    className={`focus-ring flex items-center gap-sm rounded-lg border p-sm text-left transition-colors ${
                      isCurrent
                        ? 'border-green-600 bg-green-100'
                        : isUnlocked
                          ? 'border-neutral-200 bg-neutral-50 hover:border-green-600'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-600'
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-caption font-semibold ${
                        isCompleted
                          ? 'bg-green-700 text-white'
                          : isUnlocked
                            ? 'bg-green-100 text-green-700'
                            : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {isUnlocked ? lesson.order : <LockIcon className="h-3.5 w-3.5" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-body text-neutral-950">
                        {lesson.title}
                      </span>
                      <span className="block text-caption text-neutral-600">
                        {formatDuration(lesson.durationSeconds ?? 0)} · Video
                      </span>
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
