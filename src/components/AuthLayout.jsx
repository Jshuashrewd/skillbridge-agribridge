export default function AuthLayout({ headline, subtext, children }) {
  return (
    <div className="min-h-svh bg-neutral-100 lg:flex">
      <div className="mx-auto flex min-h-svh w-full max-w-[480px] flex-col justify-center px-md py-xl lg:mx-0 lg:w-1/2 lg:max-w-none lg:px-2xl">
        <p className="mb-lg text-center text-h2 text-green-700 lg:hidden">SkillBridge</p>
        <div className="mx-auto w-full max-w-[400px]">{children}</div>
      </div>

      <div className="relative hidden shrink-0 flex-col justify-between overflow-hidden bg-green-900 px-2xl py-2xl text-neutral-50 lg:flex lg:w-1/2">
        <p className="text-h2">SkillBridge</p>
        <div className="max-w-[420px]">
          <h2 className="text-h2">{headline}</h2>
          <p className="mt-sm text-body text-green-100">{subtext}</p>
        </div>
        <div />
      </div>
    </div>
  )
}
