import { ChevronLeftIcon } from './icons'

export default function AuthLayout({ headline, subtext, onBack, children }) {
  return (
    <div className="min-h-svh bg-neutral-100 lg:flex">
      <div className="mx-auto flex min-h-svh w-full max-w-[480px] flex-col justify-center px-md py-xl lg:mx-0 lg:w-1/2 lg:max-w-none lg:px-2xl">
        <p className="mb-lg text-center text-h2 text-green-700 lg:hidden">SkillBridge</p>
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="focus-ring mb-lg hidden w-fit items-center gap-2xs text-sm text-neutral-600 transition-colors hover:text-neutral-950 lg:flex"
          >
            <ChevronLeftIcon className="h-4 w-4" /> Back
          </button>
        ) : null}
        <div className="mx-auto w-full max-w-[400px]">{children}</div>
      </div>

      <div className="relative hidden shrink-0 flex-col justify-between overflow-hidden bg-green-900 px-2xl py-2xl text-neutral-50 lg:flex lg:w-1/2">
        {/*
          Figma's Brand panel (node 126:58666) layers a hero photograph under this
          gradient. Those source images live on Figma's asset host, which this
          environment's network policy blocks from fetching directly — drop the
          exported PNGs in place as public/images/auth/hero-{base,mid,top}.png and
          render them here (object-cover, full-bleed, in that stacking order,
          beneath the gradient) to match exactly.
        */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-green-900 to-[#031a13]" />
        <p className="relative text-h2">SkillBridge</p>
        <div className="relative max-w-[420px]">
          <h2 className="text-h4">{headline}</h2>
          <p className="mt-sm text-h1 text-green-100">{subtext}</p>
        </div>
      </div>
    </div>
  )
}
