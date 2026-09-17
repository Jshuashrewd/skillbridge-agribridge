import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '../lib/firebase'

const AuthContext = createContext(undefined)

async function ensureUserDoc(user) {
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      email: user.email ?? null,
      isAnonymous: user.isAnonymous,
      streakCount: 0,
      badges: [],
      createdAt: serverTimestamp(),
    })
  }
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

  async function continueWithEmail(email, password) {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      return credential.user
    } catch (error) {
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/invalid-credential'
      ) {
        const credential = await createUserWithEmailAndPassword(auth, email, password)
        await ensureUserDoc(credential.user)
        return credential.user
      }
      throw error
    }
  }

  async function continueAsGuest() {
    const credential = await signInAnonymously(auth)
    await ensureUserDoc(credential.user)
    return credential.user
  }

  async function logOut() {
    await signOut(auth)
  }

  const value = { user, loading, continueWithEmail, continueAsGuest, logOut }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
