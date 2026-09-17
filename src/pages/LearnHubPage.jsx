import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import CourseCard from '../components/learn/CourseCard'
import MobileShell from '../components/MobileShell'
import { useAuth } from '../context/AuthContext'
import { CATEGORIES } from '../data/categories'
import { db } from '../lib/firebase'

function CategoryTab({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-sm py-2xs text-caption font-semibold transition-colors ${
        active
          ? 'border-green-600 bg-green-600 text-white'
          : 'border-neutral-200 bg-neutral-50 text-neutral-600'
      }`}
    >
      {label}
    </button>
  )
}

export default function LearnHubPage() {
  const { user, logOut } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    const coursesQuery = query(collection(db, 'courses'), orderBy('order'))
    const unsubscribe = onSnapshot(
      coursesQuery,
      (snapshot) => {
        setCourses(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
        setLoading(false)
      },
      (error) => {
        console.error('Failed to load courses', error)
        setLoading(false)
      },
    )
    return unsubscribe
  }, [])

  const groups = useMemo(() => {
    return CATEGORIES.map((category) => ({
      ...category,
      courses: courses.filter((course) => course.category === category.key),
    })).filter((group) => activeCategory === 'all' || group.key === activeCategory)
  }, [courses, activeCategory])

  return (
    <MobileShell>
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-neutral-50 px-md py-sm">
        <div className="flex items-center justify-between">
          <p className="text-h2 text-green-700">SkillBridge</p>
          <button
            type="button"
            onClick={logOut}
            title={user?.email ?? 'Guest'}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-caption font-semibold text-green-700"
          >
            {(user?.email?.[0] ?? 'G').toUpperCase()}
          </button>
        </div>

        {/* Streak & badges are placeholders until progress tracking is wired up */}
        <div className="mt-sm flex gap-xs">
          <div className="flex flex-1 items-center gap-2xs rounded-md bg-neutral-100 px-sm py-xs">
            <span className="text-caption text-neutral-600">🔥 Streak</span>
            <span className="text-caption font-semibold text-neutral-950">—</span>
          </div>
          <div className="flex flex-1 items-center gap-2xs rounded-md bg-neutral-100 px-sm py-xs">
            <span className="text-caption text-neutral-600">🏅 Badges</span>
            <span className="text-caption font-semibold text-neutral-950">—</span>
          </div>
        </div>
      </header>

      <nav className="flex gap-xs overflow-x-auto px-md py-sm" aria-label="Filter by category">
        <CategoryTab
          label="All"
          active={activeCategory === 'all'}
          onClick={() => setActiveCategory('all')}
        />
        {CATEGORIES.map((category) => (
          <CategoryTab
            key={category.key}
            label={category.label}
            active={activeCategory === category.key}
            onClick={() => setActiveCategory(category.key)}
          />
        ))}
      </nav>

      <main className="flex flex-1 flex-col gap-lg px-md pb-2xl">
        {loading ? (
          <p className="py-xl text-center text-body text-neutral-600">Loading courses…</p>
        ) : (
          groups.map((group) =>
            group.courses.length ? (
              <section key={group.key}>
                <h2 className="mb-sm text-h1 text-neutral-950">{group.label}</h2>
                <div className="flex flex-col gap-sm">
                  {group.courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </section>
            ) : null,
          )
        )}
      </main>
    </MobileShell>
  )
}
