import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import { progressRef } from './progress'

function randomSegment() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()
}

export function buildCertificateId(courseCode) {
  return `SB-${courseCode}-${randomSegment()}`
}

// Idempotent: if this learner already has a certificate for this course,
// returns the existing id instead of minting a new one.
export async function issueCertificate({ uid, userName, courseId, courseCode, courseTitle }) {
  const existingSnap = await getDoc(progressRef(uid, courseId))
  const existingId = existingSnap.exists() ? existingSnap.data().certificateId : null
  if (existingId) return existingId

  const certId = buildCertificateId(courseCode)
  await setDoc(doc(db, 'certificates', certId), {
    certId,
    userId: uid,
    userName,
    courseId,
    courseTitle,
    issuedAt: serverTimestamp(),
  })
  await setDoc(progressRef(uid, courseId), { certificateId: certId }, { merge: true })
  return certId
}

export async function getCertificate(certId) {
  const snap = await getDoc(doc(db, 'certificates', certId))
  return snap.exists() ? snap.data() : null
}
