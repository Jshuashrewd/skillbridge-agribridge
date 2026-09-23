import { ChevronLeftIcon } from "./icons";

// Figma uses three different hero photos across the Access & Account flow:
// - 'signup'   → Sign Up, Tell Us About You, Verify Email (a 3-photo composite)
// - 'login'    → Log In (a single, different photo)
// - 'recovery' → Forgot Password, Reset Password (a single, different photo again)
// Export each from Figma and save at the paths below (see README note).
const HERO_IMAGES = {
  signup: "/images/auth/hero-signup.png",
  login: "/images/auth/hero-login.png",
  recovery: "/images/auth/hero-recovery.png",
};

export default function AuthLayout({
  headline,
  subtext,
  onBack,
  hero = "signup",
  children,
}) {
  return (
    <div className="min-h-svh bg-neutral-100 lg:flex">
      {/* Brand panel — Figma places this on the left (node 126:58666, x=0 of a 1440px frame). */}
      <div className="relative hidden shrink-0 flex-col justify-between overflow-hidden bg-green-900 px-2xl py-2xl text-neutral-50 lg:flex lg:w-1/2">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${HERO_IMAGES[hero]}')` }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-green-900/[0.16] to-[#031a13]"
        />
        <p className="relative text-h2">SkillBridge</p>
        <div className="relative max-w-[420px]">
          <h2 className="text-h4">{headline}</h2>
          <p className="mt-sm text-h1 text-green-100">{subtext}</p>
        </div>
      </div>

      {/* Form panel — right side on desktop (x=720 of the 1440px frame), full-width on mobile. */}
      <div className="mx-auto flex min-h-svh w-full max-w-[480px] flex-col justify-center px-md py-xl lg:mx-0 lg:w-1/2 lg:max-w-none lg:px-2xl">
        <p className="mb-lg text-center text-h2 text-green-700 lg:hidden">
          SkillBridge
        </p>
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
    </div>
  );
}
