import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { AwardIcon, BookIcon, BookmarkIcon, HomeIcon, LogOutIcon } from './icons'

const NAV_ITEMS = [
  { key: 'discover', label: 'Discover', icon: HomeIcon, to: '/discover' },
  { key: 'learning', label: 'My Learning', icon: BookIcon, to: '/learner' },
  { key: 'saved', label: 'Saved', icon: BookmarkIcon },
  { key: 'certificates', label: 'Certificates', icon: AwardIcon, to: '/learner/certificates' },
]

function initialsFor(user) {
  const source = user?.displayName ?? user?.email ?? '?'
  return source[0]?.toUpperCase() ?? '?'
}

export default function AppShell({ active, children }) {
  const { user, logOut } = useAuth()
  const showToast = useToast()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleNavClick(item, event) {
    if (!item.to) {
      event.preventDefault()
      showToast(`${item.label} is coming soon.`)
    }
  }

  return (
    <div className="min-h-svh bg-neutral-100 lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-60 lg:shrink-0 lg:flex-col lg:border-r lg:border-neutral-200 lg:bg-neutral-50 lg:px-sm lg:py-lg">
        <p className="px-sm text-h2 text-green-700">SkillBridge</p>

        <nav className="mt-xl flex flex-col gap-2xs" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = active === item.key
            return (
              <Link
                key={item.key}
                to={item.to ?? '#'}
                onClick={(event) => handleNavClick(item, event)}
                className={`focus-ring flex min-h-11 items-center gap-sm rounded-md px-sm text-body font-semibold transition-colors ${
                  isActive
                    ? 'bg-green-600 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            )
          })}
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
        {/* Mobile/tablet top bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-md py-sm lg:hidden">
          <p className="text-h2 text-green-700">SkillBridge</p>
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              title={user?.displayName ?? user?.email ?? 'Account'}
              aria-label="Account menu"
              aria-expanded={menuOpen}
              className="focus-ring tap-target rounded-full bg-green-100 text-body font-semibold text-green-700 transition-colors hover:bg-green-200"
            >
              {initialsFor(user)}
            </button>
            <div
              aria-hidden={!menuOpen}
              className={`absolute right-0 top-12 z-20 w-44 origin-top-right rounded-md border border-neutral-200 bg-neutral-50 p-2xs shadow-lg transition-all duration-150 ease-out ${
                menuOpen
                  ? 'scale-100 opacity-100'
                  : 'pointer-events-none scale-95 opacity-0'
              }`}
            >
              <p className="truncate px-sm py-xs text-caption text-neutral-600">
                {user?.email ?? 'Guest'}
              </p>
              <button
                type="button"
                tabIndex={menuOpen ? 0 : -1}
                onClick={logOut}
                className="focus-ring flex min-h-11 w-full items-center gap-2xs rounded-sm px-sm text-left text-body font-semibold text-neutral-950 transition-colors hover:bg-neutral-100"
              >
                <LogOutIcon className="h-4 w-4" />
                Log out
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 pb-3xl lg:pb-0">{children}</main>

        {/* Mobile/tablet bottom nav */}
        <nav
          className="fixed inset-x-0 bottom-0 z-20 flex border-t border-neutral-200 bg-neutral-50 pb-[env(safe-area-inset-bottom)] lg:hidden"
          aria-label="Primary"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = active === item.key
            return (
              <Link
                key={item.key}
                to={item.to ?? '#'}
                onClick={(event) => handleNavClick(item, event)}
                className={`focus-ring flex min-h-14 flex-1 flex-col items-center justify-center gap-2xs py-2xs text-caption font-semibold transition-colors ${
                  isActive ? 'text-green-700' : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
