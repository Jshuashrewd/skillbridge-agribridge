import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from './firebase'

// One row per course the learner is enrolled in, with enough detail to
// render both the My Learning list (progress, next lesson, time left) and
// the Certificates list (issued date, certificate id).
export async function fetchLearnerCourses(uid) {
  const enrollmentsSnap = await getDocs(collection(db, 'users', uid, 'enrollments'))

  return Promise.all(
    enrollmentsSnap.docs.map(async (enrollmentDoc) => {
      const enrollment = enrollmentDoc.data()
      const courseId = enrollment.courseId

      const [courseSnap, lessonsSnap, progressSnap] = await Promise.all([
        getDoc(doc(db, 'courses', courseId)),
        getDocs(query(collection(db, 'courses', courseId, 'lessons'), orderBy('order'))),
        getDoc(doc(db, 'users', uid, 'progress', courseId)),
      ])

      const course = courseSnap.exists() ? courseSnap.data() : null
      const lessons = lessonsSnap.docs.map((lessonDoc) => ({ id: lessonDoc.id, ...lessonDoc.data() }))
      const progress = progressSnap.exists() ? progressSnap.data() : null
      const completedLessonIds = progress?.completedLessonIds ?? []
      const totalLessons = lessons.length
      const completedCount = completedLessonIds.length
      const percent = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0
      const status = progress?.status ?? 'not_started'

      const nextLesson =
        lessons.find((lesson) => lesson.id === progress?.lastLessonId) ??
        lessons.find((lesson) => !completedLessonIds.includes(lesson.id)) ??
        lessons[0] ??
        null

      const remainingSeconds = lessons
        .filter((lesson) => !completedLessonIds.includes(lesson.id))
        .reduce((sum, lesson) => sum + (lesson.durationSeconds ?? 0), 0)

      return {
        courseId,
        courseTitle: enrollment.courseTitle ?? course?.title ?? 'Course',
        courseCode: course?.code ?? '',
        status,
        completedCount,
        totalLessons,
        percent,
        nextLessonOrder: nextLesson?.order ?? null,
        nextLessonTitle: nextLesson?.title ?? null,
        nextLessonId: nextLesson?.id ?? null,
        remainingSeconds,
        certificateId: progress?.certificateId ?? null,
        completedAt: progress?.completedAt ?? null,
      }
    }),
  )
}
