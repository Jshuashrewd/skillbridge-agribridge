import { collection, onSnapshot, orderBy, query as fsQuery } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import DiscoveryCourseCard from '../components/discovery/DiscoveryCourseCard'
import SearchResultRow from '../components/discovery/SearchResultRow'
import { ChevronDownIcon, GridIcon, RowsIcon, SearchIcon, SlidersIcon, SortIcon } from '../components/icons'
import { useToast } from '../context/ToastContext'
import { CATEGORY_GROUPS } from '../data/categoryGroups'
import { db } from '../lib/firebase'

const CATEGORY_FILTERS = CATEGORY_GROUPS

const LEVEL_FILTERS = ['Beginner', 'Intermediate', 'Advanced']

// No per-course total-duration field is tracked yet (only per-lesson
// durationSeconds). lessonCount is the closest proxy available without an
// N+1 fetch of every course's lessons subcollection.
const DURATION_FILTERS = [
  { key: 'short', label: '< 2 hours', test: (course) => (course.lessonCount ?? 0) > 0 && course.lessonCount <= 3 },
  { key: 'medium', label: '2–10 hours', test: (course) => (course.lessonCount ?? 0) >= 4 && course.lessonCount <= 15 },
  { key: 'long', label: '10+ hours', test: (course) => (course.lessonCount ?? 0) > 15 },
]

const PRICE_FILTERS = [
  { key: 'free', label: 'Free', test: (course) => !course.price },
  { key: 'paid', label: 'Paid', test: (course) => Boolean(course.price) },
]

const SORT_OPTIONS = [
  { key: 'relevant', label: 'Most relevant' },
  { key: 'rating', label: 'Highest rated' },
  { key: 'price-asc', label: 'Price: low to high' },
  { key: 'price-desc', label: 'Price: high to low' },
]

const RESULT_TYPE_TABS = [
  { key: 'all', label: 'All' },
  { key: 'courses', label: 'Courses' },
  { key: 'paths', label: 'Learning paths' },
  { key: 'instructors', label: 'Instructors' },
]

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

function CheckboxRow({ label, checked, onChange }) {
  return (
    <label className="flex min-h-6 cursor-pointer items-center gap-xs text-caption text-neutral-600">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 rounded-[4px] border-neutral-200 text-green-700 focus:ring-2 focus:ring-green-600/30"
      />
      {label}
    </label>
  )
}

function FiltersPanel({ categories, setCategories, levels, setLevels, durations, setDurations, prices, setPrices, onClear }) {
  return (
    <div className="flex flex-col gap-md">
      <div className="flex items-center justify-between">
        <p className="text-h1 text-neutral-950">Filters</p>
        <button type="button" onClick={onClear} className="focus-ring text-caption text-green-700 hover:underline">
          Clear all
        </button>
      </div>

      <div className="flex flex-col gap-2xs">
        <p className="text-sm text-neutral-950">Category</p>
        {CATEGORY_FILTERS.map((filter) => (
          <CheckboxRow
            key={filter.key}
            label={filter.label}
            checked={categories.includes(filter.key)}
            onChange={() => setCategories((current) => toggleValue(current, filter.key))}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2xs">
        <p className="text-sm text-neutral-950">Level</p>
        {LEVEL_FILTERS.map((level) => (
          <CheckboxRow
            key={level}
            label={level}
            checked={levels.includes(level)}
            onChange={() => setLevels((current) => toggleValue(current, level))}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2xs">
        <p className="text-sm text-neutral-950">Duration</p>
        {DURATION_FILTERS.map((filter) => (
          <CheckboxRow
            key={filter.key}
            label={filter.label}
            checked={durations.includes(filter.key)}
            onChange={() => setDurations((current) => toggleValue(current, filter.key))}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2xs">
        <p className="text-sm text-neutral-950">Price</p>
        {PRICE_FILTERS.map((filter) => (
          <CheckboxRow
            key={filter.key}
            label={filter.label}
            checked={prices.includes(filter.key)}
            onChange={() => setPrices((current) => toggleValue(current, filter.key))}
          />
        ))}
      </div>
    </div>
  )
}

export default function SearchResultsPage() {
  const showToast = useToast()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') ?? ''
  const [queryDraft, setQueryDraft] = useState(searchQuery)
  const [allCourses, setAllCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [resultType, setResultType] = useState('all')
  const [sort, setSort] = useState('relevant')
  const [view, setView] = useState('list')
  const [sortOpen, setSortOpen] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [mobileSortOpen, setMobileSortOpen] = useState(false)

  const [categories, setCategories] = useState([])
  const [levels, setLevels] = useState([])
  const [durations, setDurations] = useState([])
  const [prices, setPrices] = useState([])

  useEffect(() => setQueryDraft(searchQuery), [searchQuery])

  useEffect(() => {
    const coursesQuery = fsQuery(collection(db, 'courses'), orderBy('order'))
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

  const activeFilterCount = categories.length + levels.length + durations.length + prices.length

  function clearFilters() {
    setCategories([])
    setLevels([])
    setDurations([])
    setPrices([])
  }

  const filtered = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase()
    return allCourses.filter((course) => {
      if (trimmed && !course.title.toLowerCase().includes(trimmed)) return false
      if (categories.length) {
        const activeCategoryKeys = categories.flatMap(
          (key) => CATEGORY_FILTERS.find((filter) => filter.key === key)?.categories ?? [],
        )
        if (!activeCategoryKeys.includes(course.category)) return false
      }
      if (levels.length && !levels.includes(course.level)) return false
      if (durations.length) {
        const matches = durations.some((key) => DURATION_FILTERS.find((filter) => filter.key === key)?.test(course))
        if (!matches) return false
      }
      if (prices.length) {
        const matches = prices.some((key) => PRICE_FILTERS.find((filter) => filter.key === key)?.test(course))
        if (!matches) return false
      }
      return true
    })
  }, [allCourses, searchQuery, categories, levels, durations, prices])

  const results = useMemo(() => {
    const list = [...filtered]
    if (sort === 'rating') list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    else if (sort === 'price-asc') list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
    else if (sort === 'price-desc') list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    return list
  }, [filtered, sort])

  const showResults = resultType === 'all' || resultType === 'courses'

  function handleSelectCourse(course) {
    if (course.status === 'coming_soon') {
      showToast(`${course.title} is coming soon.`)
    } else {
      navigate(`/course/${course.id}`)
    }
  }

  function handleSubmitQuery(event) {
    event.preventDefault()
    setSearchParams(queryDraft ? { q: queryDraft } : {})
  }

  function handleResultTypeClick(tab) {
    if (tab.key === 'paths' || tab.key === 'instructors') {
      showToast(`${tab.label} search is coming soon.`)
      return
    }
    setResultType(tab.key)
  }

  const sortLabel = SORT_OPTIONS.find((option) => option.key === sort)?.label

  return (
    <AppShell active="discover" search={{ value: queryDraft, onChange: setQueryDraft, placeholder: 'Search for courses...' }}>
      <div className="mx-auto w-full max-w-5xl px-md py-md lg:px-lg lg:py-lg">
        <form onSubmit={handleSubmitQuery} className="relative hidden lg:block">
          <span className="sr-only">Search for courses, skills, or topics</span>
          <SearchIcon className="pointer-events-none absolute left-sm top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-600" />
          <input
            type="search"
            value={queryDraft}
            onChange={(event) => setQueryDraft(event.target.value)}
            placeholder="Search for courses, skills, or topics…"
            className="w-full rounded-md border border-neutral-200 bg-neutral-50 py-sm pl-2xl pr-sm text-body text-neutral-950 outline-none transition-colors hover:border-neutral-600 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
        </form>

        <div className="mt-md flex flex-col gap-md pb-lg lg:gap-lg">
          <div className="rounded-md border border-neutral-200 bg-neutral-50 p-md lg:p-lg">
            <h1 className="text-h1 text-neutral-950 lg:text-h2">
              {searchQuery ? `Search results for "${searchQuery}"` : 'All courses'}
            </h1>
            <p className="mt-2xs text-caption text-neutral-600">
              {results.length} course{results.length === 1 ? '' : 's'} found
            </p>
          </div>

          <div className="rounded-md border border-neutral-200 bg-neutral-50 p-md lg:p-lg">
            {/* Toolbar */}
            <div className="flex flex-col gap-sm lg:flex-row lg:items-center lg:justify-between">
              <nav className="flex gap-2xs overflow-x-auto pb-2xs lg:pb-0" aria-label="Result type">
                {RESULT_TYPE_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleResultTypeClick(tab)}
                    className={`focus-ring flex h-[38px] shrink-0 items-center justify-center whitespace-nowrap rounded-[10px] border px-md text-caption transition-colors ${
                      resultType === tab.key
                        ? 'border-green-700 bg-green-700 text-white'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-950 hover:border-neutral-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Desktop sort + view toggle */}
              <div className="relative hidden items-center gap-md lg:flex">
                <button
                  type="button"
                  onClick={() => setSortOpen((open) => !open)}
                  className="focus-ring flex h-[38px] items-center gap-xs rounded-[10px] border border-neutral-200 pl-md pr-sm text-caption text-neutral-950"
                >
                  {sortLabel}
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
                {sortOpen ? (
                  <div className="absolute right-[108px] top-11 z-10 w-48 rounded-md border border-neutral-200 bg-neutral-50 p-2xs shadow-lg">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => {
                          setSort(option.key)
                          setSortOpen(false)
                        }}
                        className={`focus-ring flex min-h-9 w-full items-center rounded-sm px-sm text-left text-caption transition-colors hover:bg-neutral-100 ${
                          sort === option.key ? 'font-semibold text-green-700' : 'text-neutral-950'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                ) : null}
                <div className="flex h-10 items-center gap-2xs rounded-[10px] bg-neutral-100 p-2xs">
                  <button
                    type="button"
                    onClick={() => setView('list')}
                    aria-label="List view"
                    className={`focus-ring flex h-8 w-10 items-center justify-center rounded-sm ${view === 'list' ? 'bg-green-100' : ''}`}
                  >
                    <RowsIcon className="h-[18px] w-[18px] text-neutral-950" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView('grid')}
                    aria-label="Grid view"
                    className={`focus-ring flex h-8 w-10 items-center justify-center rounded-sm ${view === 'grid' ? 'bg-green-100' : ''}`}
                  >
                    <GridIcon className="h-[18px] w-[18px] text-neutral-950" />
                  </button>
                </div>
              </div>

              {/* Mobile filter + sort triggers */}
              <div className="flex gap-2xs lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="focus-ring flex h-[42px] flex-1 items-center justify-center gap-2xs rounded-[10px] border border-neutral-200 text-caption text-neutral-950"
                >
                  <SlidersIcon className="h-4 w-4" />
                  Filters{activeFilterCount ? ` (${activeFilterCount})` : ''}
                </button>
                <button
                  type="button"
                  onClick={() => setMobileSortOpen(true)}
                  className="focus-ring flex h-[42px] flex-1 items-center justify-center gap-2xs rounded-[10px] border border-neutral-200 text-caption text-neutral-950"
                >
                  <SortIcon className="h-4 w-4" />
                  Sort
                </button>
                <button
                  type="button"
                  onClick={() => setView((current) => (current === 'list' ? 'grid' : 'list'))}
                  aria-label="Toggle view"
                  className="focus-ring flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] border border-neutral-200"
                >
                  {view === 'list' ? (
                    <GridIcon className="h-[18px] w-[18px] text-neutral-950" />
                  ) : (
                    <RowsIcon className="h-[18px] w-[18px] text-neutral-950" />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-md flex flex-col gap-lg lg:flex-row lg:items-start">
              {/* Desktop filter sidebar */}
              <div className="hidden w-[250px] shrink-0 rounded-md border border-neutral-200 p-md lg:block">
                <FiltersPanel
                  categories={categories}
                  setCategories={setCategories}
                  levels={levels}
                  setLevels={setLevels}
                  durations={durations}
                  setDurations={setDurations}
                  prices={prices}
                  setPrices={setPrices}
                  onClear={clearFilters}
                />
              </div>

              {/* Results */}
              <div className="min-w-0 flex-1">
                {!showResults ? (
                  <p className="py-xl text-center text-body text-neutral-600">
                    {RESULT_TYPE_TABS.find((tab) => tab.key === resultType)?.label} results aren't available yet.
                  </p>
                ) : loading ? (
                  <p className="py-xl text-center text-body text-neutral-600">Loading courses…</p>
                ) : results.length === 0 ? (
                  <p className="py-xl text-center text-body text-neutral-600">
                    No courses match your search and filters.
                  </p>
                ) : view === 'grid' ? (
                  <div className="flex flex-wrap gap-sm">
                    {results.map((course) => (
                      <DiscoveryCourseCard key={course.id} course={course} onSelect={handleSelectCourse} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-sm">
                    {results.map((course) => (
                      <SearchResultRow key={course.id} course={course} onSelect={handleSelectCourse} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filters bottom sheet */}
      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-30 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-neutral-950/40"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-lg bg-neutral-50 p-md shadow-lg">
            <FiltersPanel
              categories={categories}
              setCategories={setCategories}
              levels={levels}
              setLevels={setLevels}
              durations={durations}
              setDurations={setDurations}
              prices={prices}
              setPrices={setPrices}
              onClear={clearFilters}
            />
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="focus-ring mt-lg min-h-11 w-full rounded-md bg-green-700 text-body font-semibold text-white transition-colors hover:bg-green-800"
            >
              Show {results.length} result{results.length === 1 ? '' : 's'}
            </button>
          </div>
        </div>
      ) : null}

      {/* Mobile sort sheet */}
      {mobileSortOpen ? (
        <div className="fixed inset-0 z-30 lg:hidden">
          <button
            type="button"
            aria-label="Close sort options"
            onClick={() => setMobileSortOpen(false)}
            className="absolute inset-0 bg-neutral-950/40"
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-lg bg-neutral-50 p-md shadow-lg">
            <p className="text-h1 text-neutral-950">Sort by</p>
            <div className="mt-sm flex flex-col gap-2xs">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => {
                    setSort(option.key)
                    setMobileSortOpen(false)
                  }}
                  className={`focus-ring flex min-h-11 w-full items-center rounded-md px-sm text-left text-body transition-colors hover:bg-neutral-100 ${
                    sort === option.key ? 'font-semibold text-green-700' : 'text-neutral-950'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  )
}
