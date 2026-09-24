import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import CompactCourseCard from '../components/discovery/CompactCourseCard'
import CourseRow from '../components/discovery/CourseRow'
import { BriefcaseIcon, BrushIcon, CodeIcon, SearchIcon, SpeakerIcon } from '../components/icons'
import { useToast } from '../context/ToastContext'
import { CATEGORIES } from '../data/categories'
import { db } from '../lib/firebase'

const MOBILE_CATEGORY_TILES = [
  { key: 'design', label: 'Design', icon: BrushIcon, bg: '#e5f6ec', categories: ['ui-ux-design', 'graphic-design', '3d-animation', 'photography', 'branding'] },
  { key: 'business', label: 'Business', icon: BriefcaseIcon, bg: '#eaf2ff', categories: ['business'] },
  { key: 'technology', label: 'Tech', icon: CodeIcon, bg: '#f2ecff', categories: ['technology'] },
  { key: 'marketing', label: 'Marketing', icon: SpeakerIcon, bg: '#fff0ea', categories: ['business'] },
]

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
  const [activeCategories, setActiveCategories] = useState(null) // null = all
  const [searchDraft, setSearchDraft] = useState('')

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
      activeCategories === null
        ? allCourses
        : allCourses.filter((course) => activeCategories.includes(course.category)),
    [allCourses, activeCategories],
  )

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

  function handleSubmitSearch(event) {
    event.preventDefault()
    navigate(searchDraft ? `/search?q=${encodeURIComponent(searchDraft)}` : '/search')
  }

  const searchField = {
    value: searchDraft,
    onChange: setSearchDraft,
    placeholder: 'Search for courses...',
  }

  return (
    <AppShell active="discover" search={searchField}>
      <div className="mx-auto w-full max-w-5xl px-md py-md lg:px-lg lg:py-lg">
        <form onSubmit={handleSubmitSearch} className="relative hidden lg:block">
          <span className="sr-only">Search for courses, skills, or topics</span>
          <SearchIcon className="pointer-events-none absolute left-sm top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-600" />
          <input
            type="search"
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder="Search for courses, skills, or topics…"
            className="w-full rounded-md border border-neutral-200 bg-neutral-50 py-sm pl-2xl pr-sm text-body text-neutral-950 outline-none transition-colors hover:border-neutral-600 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
        </form>

        {/* Desktop hero + full catalog */}
        <div className="relative mt-md hidden overflow-hidden rounded-lg bg-green-900 px-xl py-2xl text-neutral-50 lg:block">
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/discovery/hero.jpg')" }}
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

        <nav className="mt-md hidden gap-xs overflow-x-auto pb-2xs lg:flex" aria-label="Filter by category">
          <CategoryChip label="All" active={activeCategories === null} onClick={() => setActiveCategories(null)} />
          {CATEGORIES.map((category) => (
            <CategoryChip
              key={category.key}
              label={category.label}
              active={Boolean(activeCategories?.length === 1 && activeCategories[0] === category.key)}
              onClick={() => setActiveCategories([category.key])}
            />
          ))}
        </nav>

        <div className="mt-lg hidden flex-col gap-lg pb-lg lg:flex">
          {loading ? (
            <p className="py-xl text-center text-body text-neutral-600">Loading courses…</p>
          ) : (
            <>
              <div id="popular-courses">
                <CourseRow title="Popular courses" courses={courses} onSelectCourse={handleSelectCourse} />
              </div>
              <CourseRow title="Recommended for you" courses={recommended} onSelectCourse={handleSelectCourse} />
              <CourseRow
                title="Trending courses"
                courses={trending}
                onSelectCourse={handleSelectCourse}
                variant="trending"
              />
            </>
          )}
        </div>

        {/* Mobile: Hero → Popular categories → Recommended for you */}
        <div className="flex flex-col gap-lg py-sm lg:hidden">
          <div className="relative h-[234px] overflow-hidden rounded-lg bg-green-900 text-neutral-50">
            <div
              aria-hidden
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/discovery/hero.jpg')" }}
            />
            <div aria-hidden className="absolute inset-0 bg-green-900/45" />
            <div className="relative px-md py-md">
              <p className="text-[10px] font-semibold uppercase leading-[14px] tracking-[1.2px] text-green-100">
                Learn today. Build tomorrow.
              </p>
              <h1 className="mt-sm text-h1 leading-tight">Gain in-demand skills for a brighter future</h1>
              <p className="mt-2xs text-caption text-green-100">Explore expert-led courses at your own pace.</p>
              <button
                type="button"
                onClick={() => document.getElementById('mobile-recommended')?.scrollIntoView({ behavior: 'smooth' })}
                className="focus-ring mt-md min-h-11 rounded-md bg-green-700 px-md py-sm text-caption font-semibold text-white transition-colors hover:bg-green-800"
              >
                Explore courses →
              </button>
            </div>
          </div>

          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-h1 text-neutral-950">Popular categories</h2>
              <button
                type="button"
                onClick={() => setActiveCategories(null)}
                className="focus-ring text-caption text-green-700 hover:underline"
              >
                View all →
              </button>
            </div>
            <div className="mt-sm grid grid-cols-4 gap-xs">
              {MOBILE_CATEGORY_TILES.map((tile) => {
                const Icon = tile.icon
                const isActive =
                  activeCategories?.length === tile.categories.length &&
                  tile.categories.every((key) => activeCategories.includes(key))
                return (
                  <button
                    key={tile.key}
                    type="button"
                    onClick={() => setActiveCategories(isActive ? null : tile.categories)}
                    style={{ backgroundColor: tile.bg }}
                    className={`focus-ring flex flex-col items-center justify-center gap-2xs rounded-md py-sm text-center transition-shadow ${
                      isActive ? 'ring-2 ring-green-700' : ''
                    }`}
                  >
                    <Icon className="h-[22px] w-[22px] text-neutral-950" />
                    <span className="text-caption text-neutral-950">{tile.label}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <section id="mobile-recommended">
            <h2 className="text-h1 text-neutral-950">Recommended for you</h2>
            {loading ? (
              <p className="mt-sm py-xl text-center text-body text-neutral-600">Loading courses…</p>
            ) : (
              <div className="mt-sm flex flex-col gap-sm">
                {(activeCategories ? courses : recommended).slice(0, 6).map((course) => (
                  <CompactCourseCard key={course.id} course={course} onSelect={handleSelectCourse} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  )
}
