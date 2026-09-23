import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import CourseRow from '../components/discovery/CourseRow'
import SearchResultCard from '../components/discovery/SearchResultCard'
import { SearchIcon } from '../components/icons'
import { useToast } from '../context/ToastContext'
import { CATEGORIES } from '../data/categories'
import { db } from '../lib/firebase'

function CategoryChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`focus-ring flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-[10px] border px-md text-caption transition-colors ${
        active
          ? 'border-green-700 bg-green-700 text-white'
          : 'border-neutral-200 bg-neutral-50 text-neutral-950 hover:border-neutral-600'
      }`}
    >
      {label}
    </button>
  )
}

export default function CourseDiscoveryPage() {
  const showToast = useToast()
  const navigate = useNavigate()
  const [allCourses, setAllCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

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

  function handleSelectCourse(course) {
    if (course.status === 'coming_soon') {
      showToast(`${course.title} is coming soon.`)
    } else {
      navigate(`/course/${course.id}`)
    }
  }

  return (
    <AppShell active="discover">
      <div className="mx-auto w-full max-w-5xl px-md py-md lg:px-xl lg:py-lg">
        <label className="relative block">
          <span className="sr-only">Search for courses, skills, or topics</span>
          <SearchIcon className="pointer-events-none absolute left-sm top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-600" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search for courses, skills, or topics…"
            className="w-full rounded-md border border-neutral-200 bg-neutral-50 py-sm pl-2xl pr-sm text-body text-neutral-950 outline-none transition-colors hover:border-neutral-600 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
        </label>

        {searchResults ? (
          <div className="mt-md flex flex-col gap-sm pb-lg">
            <p className="text-caption text-neutral-600">
              {searchResults.length} result{searchResults.length === 1 ? '' : 's'} for "
              {searchQuery}"
            </p>
            {searchResults.map((course) => (
              <SearchResultCard key={course.id} course={course} onSelect={handleSelectCourse} />
            ))}
          </div>
        ) : (
          <>
            <div className="relative mt-md overflow-hidden rounded-lg bg-green-900 px-md py-lg text-neutral-50 lg:px-xl lg:py-2xl">
              {/* Hero photo — export from Figma (node 79:637 "Hero") and save as public/images/discovery/hero.png */}
              <div
                aria-hidden
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/discovery/hero.png')" }}
              />
              <div aria-hidden className="absolute inset-0 bg-green-900/45" />
              <div className="relative">
                <p className="text-[10px] font-semibold uppercase leading-[14px] tracking-[1.2px] text-green-100">
                  Learn today. Build tomorrow.
                </p>
                <h1 className="mt-sm text-h3 lg:max-w-[580px]">Gain in-demand skills for a brighter future</h1>
                <p className="mt-2xs max-w-[570px] text-body text-green-100">
                  Explore thousands of expert-led courses and take the next step in your career,
                  business, or personal growth.
                </p>
                <button
                  type="button"
                  onClick={() => document.getElementById('popular-courses')?.scrollIntoView({ behavior: 'smooth' })}
                  className="focus-ring mt-lg min-h-11 rounded-md bg-green-700 px-lg py-sm text-body text-white transition-colors hover:bg-green-800"
                >
                  Explore courses →
                </button>
              </div>
            </div>

            <nav
              className="mt-md flex gap-xs overflow-x-auto pb-2xs"
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

            <div className="mt-lg flex flex-col gap-lg pb-lg">
              {loading ? (
                <p className="py-xl text-center text-body text-neutral-600">Loading courses…</p>
              ) : (
                <>
                  <div id="popular-courses">
                    <CourseRow title="Popular courses" courses={courses} onSelectCourse={handleSelectCourse} />
                  </div>
                  <CourseRow
                    title="Recommended for you"
                    courses={recommended}
                    onSelectCourse={handleSelectCourse}
                  />
                  <CourseRow
                    title="Trending courses"
                    courses={trending}
                    onSelectCourse={handleSelectCourse}
                    variant="trending"
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}
