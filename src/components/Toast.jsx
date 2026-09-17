import { useEffect } from 'react'

export default function Toast({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return undefined
    const timer = setTimeout(onDismiss, 3000)
    return () => clearTimeout(timer)
  }, [message, onDismiss])

  if (!message) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-md pb-lg">
      <div className="pointer-events-auto max-w-[358px] rounded-md bg-neutral-950 px-md py-sm text-center text-caption font-medium text-white shadow-lg">
        {message}
      </div>
    </div>
  )
}
