import { arrayUnion, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from './firebase'

export function progressRef(uid, courseId) {
  return doc(db, 'users', uid, 'progress', courseId)
}

export async function getProgress(uid, courseId) {
  const snap = await getDoc(progressRef(uid, courseId))
  return snap.exists() ? snap.data() : null
}

// Ensures a progress doc exists and records the lesson the learner is
// currently viewing, without marking anything complete.
export async function touchProgress(uid, courseId, lessonId) {
  const ref = progressRef(uid, courseId)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    const initial = {
      courseId,
      status: 'in_progress',
      completedLessonIds: [],
      lastLessonId: lessonId,
      startedAt: serverTimestamp(),
      completedAt: null,
      certificateId: null,
      updatedAt: serverTimestamp(),
    }
    await setDoc(ref, initial)
    return initial
  }
  await setDoc(ref, { lastLessonId: lessonId, updatedAt: serverTimestamp() }, { merge: true })
  return snap.data()
}

// Marks a lesson's knowledge check as passed. Returns the resulting
// progress data, including whether the whole course is now complete.
export async function completeLesson(uid, courseId, lessonId, totalLessons) {
  const ref = progressRef(uid, courseId)
  await setDoc(
    ref,
    {
      courseId,
      completedLessonIds: arrayUnion(lessonId),
      lastLessonId: lessonId,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
  const snap = await getDoc(ref)
  const data = snap.data()
  const completedCount = data.completedLessonIds?.length ?? 0
  const isComplete = completedCount >= totalLessons

  if (isComplete && data.status !== 'completed') {
    await setDoc(ref, { status: 'completed', completedAt: serverTimestamp() }, { merge: true })
  }

  return { ...data, status: isComplete ? 'completed' : 'in_progress' }
}
