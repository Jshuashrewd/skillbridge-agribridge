import { useEffect, useState } from 'react'

export default function Toast({ message, onDismiss }) {
  const [displayMessage, setDisplayMessage] = useState('')

  useEffect(() => {
    if (!message) return undefined
    setDisplayMessage(message)
    const timer = setTimeout(onDismiss, 3000)
    return () => clearTimeout(timer)
  }, [message, onDismiss])

  const visible = Boolean(message)

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-md pb-lg lg:pb-xl">
      <div
        role="status"
        aria-live="polite"
        onTransitionEnd={() => {
          if (!visible) setDisplayMessage('')
        }}
        className={`max-w-[358px] rounded-md bg-neutral-950 px-md py-sm text-center text-caption font-medium text-white shadow-lg transition-all duration-200 ease-out ${
          visible ? 'pointer-events-auto translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}
      >
        {displayMessage}
      </div>
    </div>
  )
}
