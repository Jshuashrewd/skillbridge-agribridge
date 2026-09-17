import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import CourseRow from '../components/discovery/CourseRow'
import SearchResultCard from '../components/discovery/SearchResultCard'
import MobileShell from '../components/MobileShell'
import { useAuth } from '../context/AuthContext'
import { CATEGORIES } from '../data/categories'
import { db } from '../lib/firebase'

function CategoryChip({ label, active, onClick }) {
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

export default function CourseDiscoveryPage() {
  const { user, logOut } = useAuth()
  const [allCourses, setAllCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const coursesQuery = query(collection(db, 'courses'), orderBy('order'))
    const unsubscribe = onSnapshot(
      coursesQuery,
      (snapshot) => {
        setAllCourses(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })))
        setLoading(false)
      },
      (error) => {
        console.error('Failed to load courses', error)
        setLoading(false)
      },
    )
    return unsubscribe
  }, [])

  const courses = useMemo(
    () =>
      activeCategory === 'all'
        ? allCourses
        : allCourses.filter((course) => course.category === activeCategory),
    [allCourses, activeCategory],
  )

  const searchResults = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase()
    if (!trimmed) return null
    return allCourses.filter((course) => course.title.toLowerCase().includes(trimmed))
  }, [allCourses, searchQuery])

  // No real popularity/personalization signal yet — Recommended takes one
  // course per category (surfacing the real course + catalog diversity),
  // Trending is everything else. Popular is the full catalog. Replace with
  // real signals once usage data exists.
  const { recommended, trending } = useMemo(() => {
    const picks = []
    for (const category of CATEGORIES) {
      const match = courses.find((course) => course.category === category.key)
      if (match) picks.push(match.id)
    }
    return {
      recommended: courses.filter((course) => picks.includes(course.id)),
      trending: courses.filter((course) => !picks.includes(course.id)),
    }
  }, [courses])

  return (
    <MobileShell>
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-neutral-50 px-md py-sm">
        <div className="flex items-center justify-between">
          <p className="text-h2 text-green-700">SkillBridge</p>
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              title={user?.displayName ?? user?.email ?? 'Account'}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-caption font-semibold text-green-700"
            >
              {(user?.displayName?.[0] ?? user?.email?.[0] ?? '?').toUpperCase()}
            </button>
            {menuOpen ? (
              <div className="absolute right-0 top-10 z-20 w-40 rounded-md border border-neutral-200 bg-neutral-50 p-2xs shadow-lg">
                <button
                  type="button"
                  onClick={logOut}
                  className="w-full rounded-sm px-sm py-xs text-left text-caption font-semibold text-neutral-950 hover:bg-neutral-100"
                >
                  Log out
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <label className="mt-sm block">
          <span className="sr-only">Search for courses, skills, or topics</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search for courses, skills, or topics…"
            className="w-full rounded-md border border-neutral-200 bg-neutral-100 px-sm py-sm text-body text-neutral-950 outline-none focus:border-green-600"
          />
        </label>
      </header>

      {searchResults ? (
        <main className="flex flex-1 flex-col gap-sm px-md py-sm pb-2xl">
          <p className="text-caption text-neutral-600">
            {searchResults.length} result{searchResults.length === 1 ? '' : 's'} for "{searchQuery}"
          </p>
          {searchResults.map((course) => (
            <SearchResultCard key={course.id} course={course} />
          ))}
        </main>
      ) : (
        <>
          <div className="mx-md mt-sm rounded-lg bg-green-900 px-md py-lg text-neutral-50">
            <p className="text-caption uppercase tracking-wide text-green-200">
              Learn today. Build tomorrow.
            </p>
            <h1 className="mt-2xs text-h1">Gain in-demand skills for a brighter future</h1>
            <p className="mt-2xs text-caption text-green-100">
              Practical courses for ag-tech, digital literacy, and entrepreneurship.
            </p>
          </div>

          <nav
            className="flex gap-xs overflow-x-auto px-md py-sm"
            aria-label="Filter by category"
          >
            <CategoryChip
              label="All"
              active={activeCategory === 'all'}
              onClick={() => setActiveCategory('all')}
            />
            {CATEGORIES.map((category) => (
              <CategoryChip
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
              <>
                <CourseRow title="Popular courses" courses={courses} />
                <CourseRow title="Recommended for you" courses={recommended} />
                <CourseRow title="Trending courses" courses={trending} />
              </>
            )}
          </main>
        </>
      )}
    </MobileShell>
  )
}
