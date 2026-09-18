const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function HomeIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12 12 3l9 9" />
      <path d="M5 10v10a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1V10" />
    </svg>
  )
}

export function BookIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 5c2-1 5-1 7 0v14c-2-1-5-1-7 0V5Z" />
      <path d="M21 5c-2-1-5-1-7 0v14c2-1 5-1 7 0V5Z" />
    </svg>
  )
}

export function BookmarkIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3h12v18l-6-4-6 4V3Z" />
    </svg>
  )
}

export function AwardIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="5" />
      <path d="M8.5 12.5 7 21l5-3 5 3-1.5-8.5" />
    </svg>
  )
}

export function MenuIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

export function CloseIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

export function SearchIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

export function ChevronDownIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function LogOutIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  )
}

export function CreditCardIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  )
}

export function BankIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 10 12 4l9 6" />
      <path d="M5 10v9M9 10v9M15 10v9M19 10v9" />
      <path d="M3 19h18" />
    </svg>
  )
}

export function PhoneIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <path d="M11 18h2" />
    </svg>
  )
}

export function CheckCircleIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="m8 12 3 3 5-6" />
    </svg>
  )
}

export function ChevronLeftIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m15 6-6 6 6 6" />
    </svg>
  )
}

export function PlayIcon(props) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5Z" />
    </svg>
  )
}

export function LockIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}

export function TrophyIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
      <path d="M7 5H4a3 3 0 0 0 3 5" />
      <path d="M17 5h3a3 3 0 0 1-3 5" />
      <path d="M12 13v4" />
      <path d="M9 21h6" />
      <path d="M9.5 17h5l1 4h-7l1-4Z" />
    </svg>
  )
}

export function DownloadIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 19h16" />
    </svg>
  )
}

export function FileTextIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  )
}

export function XCircleIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9.5 9.5 5 5m0-5-5 5" />
    </svg>
  )
}
