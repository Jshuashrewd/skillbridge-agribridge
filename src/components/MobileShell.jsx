export default function MobileShell({ children, className = '' }) {
  return (
    <div className="min-h-svh bg-neutral-200">
      <div
        className={`mx-auto flex min-h-svh w-full max-w-[390px] flex-col bg-neutral-50 ${className}`}
      >
        {children}
      </div>
    </div>
  )
}
