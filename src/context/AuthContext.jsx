import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '../lib/firebase'

const AuthContext = createContext(undefined)
const googleProvider = new GoogleAuthProvider()

async function ensureUserDoc(user) {
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      isAnonymous: user.isAnonymous,
      role: null,
      streakCount: 0,
      badges: [],
      createdAt: serverTimestamp(),
    })
  }
  return snap.exists() ? snap.data() : null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function logIn(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    return credential.user
  }

  async function signUp(email, password, { firstName, lastName }) {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    const displayName = [firstName, lastName].filter(Boolean).join(' ')
    if (displayName) {
      await updateProfile(credential.user, { displayName })
    }
    await ensureUserDoc({ ...credential.user, displayName })
    return credential.user
  }

  async function continueWithGoogle() {
    const credential = await signInWithPopup(auth, googleProvider)
    const existing = await ensureUserDoc(credential.user)
    return { user: credential.user, role: existing?.role ?? null }
  }

  async function setUserRole(role) {
    if (!auth.currentUser) throw new Error('Not signed in')
    await setDoc(doc(db, 'users', auth.currentUser.uid), { role }, { merge: true })
  }

  async function getCurrentUserRole() {
    if (!auth.currentUser) return null
    const snap = await getDoc(doc(db, 'users', auth.currentUser.uid))
    return snap.exists() ? (snap.data().role ?? null) : null
  }

  async function logOut() {
    await signOut(auth)
  }

  const value = {
    user,
    loading,
    logIn,
    signUp,
    continueWithGoogle,
    setUserRole,
    getCurrentUserRole,
    logOut,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
