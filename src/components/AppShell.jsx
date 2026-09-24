import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import {
  AwardIcon,
  BellIcon,
  BookIcon,
  BookmarkIcon,
  CloseIcon,
  GridIcon,
  HelpCircleIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  MessageIcon,
  SearchIcon,
  SettingsIcon,
} from './icons'

const MAIN_NAV_ITEMS = [
  { key: 'home', label: 'Home', icon: HomeIcon, to: '/home' },
  { key: 'discover', label: 'Browse Courses', icon: GridIcon, to: '/discover' },
  { key: 'learning', label: 'My Learning', icon: BookIcon, to: '/learner' },
  { key: 'saved', label: 'Saved', icon: BookmarkIcon },
  { key: 'certificates', label: 'Certificates', icon: AwardIcon, to: '/learner/certificates' },
  { key: 'messages', label: 'Messages', icon: MessageIcon },
]

const UTILITY_NAV_ITEMS = [
  { key: 'settings', label: 'Settings', icon: SettingsIcon },
  { key: 'help', label: 'Help & Support', icon: HelpCircleIcon },
]

function initialsFor(user) {
  const source = user?.displayName ?? user?.email ?? '?'
  return source[0]?.toUpperCase() ?? '?'
}

function NavLink({ item, active, onClick }) {
  const Icon = item.icon
  const isActive = active === item.key

  return (
    <Link
      to={item.to ?? '#'}
      onClick={onClick}
      className={`focus-ring flex min-h-11 items-center gap-sm rounded-md px-sm text-sm transition-colors ${
        isActive ? 'bg-green-900 font-semibold text-white' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950'
      }`}
    >
      <Icon className="h-[22px] w-[22px] shrink-0" />
      {item.label}
    </Link>
  )
}

export default function AppShell({ active, children, search }) {
  const { user, logOut } = useAuth()
  const showToast = useToast()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  function handleNavClick(item, event) {
    setDrawerOpen(false)
    if (!item.to) {
      event.preventDefault()
      showToast(`${item.label} is coming soon.`)
    }
  }

  function handleMobileSearchSubmit(event) {
    event.preventDefault()
    if (search?.onChange) return
    const value = event.target.elements.mobileSearch.value.trim()
    navigate(value ? `/search?q=${encodeURIComponent(value)}` : '/search')
  }

  return (
    <div className="min-h-svh bg-neutral-100 lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-svh lg:w-60 lg:shrink-0 lg:flex-col lg:border-r lg:border-neutral-200 lg:bg-neutral-50 lg:px-sm lg:py-lg">
        <p className="px-sm text-h2 text-neutral-950">SkillBridge</p>

        <nav className="mt-xl flex flex-col gap-2xs" aria-label="Primary">
          {MAIN_NAV_ITEMS.map((item) => (
            <NavLink key={item.key} item={item} active={active} onClick={(event) => handleNavClick(item, event)} />
          ))}
        </nav>

        <div className="my-md h-px shrink-0 bg-neutral-200" />

        <nav className="flex flex-col gap-2xs" aria-label="Support">
          {UTILITY_NAV_ITEMS.map((item) => (
            <NavLink key={item.key} item={item} active={active} onClick={(event) => handleNavClick(item, event)} />
          ))}
        </nav>

        <div className="mt-auto flex items-center gap-xs rounded-md px-sm py-xs">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-body font-semibold text-green-700">
            {initialsFor(user)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-caption font-semibold text-neutral-950">
              {user?.displayName ?? 'Learner'}
            </p>
            <p className="truncate text-caption text-neutral-600">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={logOut}
            title="Log out"
            aria-label="Log out"
            className="focus-ring tap-target shrink-0 rounded-md text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
          >
            <LogOutIcon className="h-5 w-5" />
          </button>
        </div>
      </aside>

      <div className="flex min-h-svh flex-1 flex-col lg:min-w-0">
        {/* Mobile/tablet top header — SkillBridge / Product Header (mobile) */}
        <header className="sticky top-0 z-10 flex flex-col gap-sm bg-[#f8faf9] px-md pb-sm pt-md lg:hidden">
          <div className="flex h-[30px] items-center gap-sm">
            <p className="text-h2 text-neutral-950">SkillBridge</p>
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => showToast('Notifications are coming soon.')}
              aria-label="Notifications"
              className="focus-ring tap-target relative text-neutral-950"
            >
              <BellIcon className="h-[21px] w-[21px]" />
            </button>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              className="focus-ring tap-target text-neutral-950"
            >
              <MenuIcon className="h-[22px] w-[22px]" />
            </button>
          </div>
          {search ? (
            <label className="relative block">
              <span className="sr-only">{search.placeholder ?? 'Search'}</span>
              <SearchIcon className="pointer-events-none absolute left-sm top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-600" />
              <input
                type="search"
                value={search.value}
                onChange={(event) => search.onChange(event.target.value)}
                placeholder={search.placeholder ?? 'Search for courses...'}
                className="w-full rounded-md border-none bg-[#f5f7f6] py-sm pl-2xl pr-sm text-sm text-neutral-950 outline-none focus:ring-2 focus:ring-green-600/20"
              />
            </label>
          ) : (
            <form onSubmit={handleMobileSearchSubmit} className="relative block">
              <span className="sr-only">Search for courses</span>
              <SearchIcon className="pointer-events-none absolute left-sm top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-600" />
              <input
                type="search"
                name="mobileSearch"
                placeholder="Search for courses..."
                className="w-full rounded-md border-none bg-[#f5f7f6] py-sm pl-2xl pr-sm text-sm text-neutral-950 outline-none focus:ring-2 focus:ring-green-600/20"
              />
            </form>
          )}
        </header>

        <main className="flex-1">{children}</main>
      </div>

      {/* Mobile nav drawer, opened from the hamburger button */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-30 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-neutral-950/40"
          />
          <div className="absolute right-0 top-0 flex h-full w-[280px] max-w-[85vw] flex-col bg-neutral-50 px-sm py-lg shadow-lg">
            <div className="flex items-center justify-between px-sm">
              <p className="text-h2 text-neutral-950">SkillBridge</p>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="focus-ring tap-target text-neutral-600"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-lg flex flex-col gap-2xs" aria-label="Primary">
              {MAIN_NAV_ITEMS.map((item) => (
                <NavLink key={item.key} item={item} active={active} onClick={(event) => handleNavClick(item, event)} />
              ))}
            </nav>

            <div className="my-md h-px shrink-0 bg-neutral-200" />

            <nav className="flex flex-col gap-2xs" aria-label="Support">
              {UTILITY_NAV_ITEMS.map((item) => (
                <NavLink key={item.key} item={item} active={active} onClick={(event) => handleNavClick(item, event)} />
              ))}
            </nav>

            <div className="mt-auto flex items-center gap-xs rounded-md px-sm py-xs">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-body font-semibold text-green-700">
                {initialsFor(user)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-caption font-semibold text-neutral-950">
                  {user?.displayName ?? 'Learner'}
                </p>
                <p className="truncate text-caption text-neutral-600">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={logOut}
                title="Log out"
                aria-label="Log out"
                className="focus-ring tap-target shrink-0 rounded-md text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
              >
                <LogOutIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
