# SkillBridge

Vocational learning hub prototype for youth and ag-entrepreneurs — course
browsing, enrollment, a video-lesson player with knowledge-check quizzes,
downloadable certificates, and a Learner Hub dashboard. Part of the larger
AgriBridge app; this repo builds the SkillBridge piece only.

Built with React + Vite, Tailwind CSS, React Router, and Firebase
(Auth + Firestore). Fully responsive: sidebar nav on desktop (≥1024px),
bottom nav on mobile/tablet, matching the Figma design in `/design`.

No real payment gateway or video hosting is integrated — checkout, video
playback, and social "Share" actions are UI-only by design (a prototype
constraint, not an oversight). Certificate downloads (PDF/PNG) and the one
seeded Toolkit PDF are real files, not placeholders.

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a Firebase project** at [console.firebase.google.com](https://console.firebase.google.com):
   - Enable **Authentication** → Email/Password and Google sign-in methods.
   - Enable **Firestore Database** (start in test mode, or deploy
     `firestore.rules` — see Deploy below).
   - Copy your web app's Firebase config into `.env` (copy `.env.example`
     first).

3. **Run the dev server**

   ```bash
   npm run dev
   ```

4. **Seed Firestore** with the course catalog (1 full course with lessons,
   objectives, and quizzes; 8 "coming soon" placeholders):

   ```bash
   npm run seed
   ```

   See `docs/firestore-schema.md` for the full schema.

## Deploy

This repo is configured for **Firebase Hosting** (same project as
Auth/Firestore, so no new account is needed). A `vercel.json` is also
included if you'd rather use Vercel instead.

### Firebase Hosting (recommended)

```bash
npm run build
npx firebase-tools login
npx firebase-tools deploy
```

That deploys the built `dist/` folder as Hosting **and** applies
`firestore.rules` (replacing Firestore's default test-mode rules, which
otherwise expire 30 days after project creation). Firebase prints the live
URL (`https://<project-id>.web.app`) when it finishes.

### Vercel (alternative)

```bash
npm run build
npx vercel --prod
```

Vercel auto-detects the Vite build; `vercel.json` adds the SPA rewrite so
client-side routes (e.g. `/course/:id`, `/verify/:certId`) work on a hard
refresh. Set the same `VITE_FIREBASE_*` variables from `.env` as Vercel
project environment variables first (Project Settings → Environment
Variables) — Vercel doesn't read your local `.env` file.

## Structure

```
src/
  lib/                       firebase.js, format.js, progress.js, certificate.js,
                              learnerCourses.js
  context/                   AuthContext, ToastContext
  components/
    AppShell.jsx              Sidebar (desktop) / bottom nav (mobile) shell
    AuthLayout.jsx             Split-panel layout for sign-up/login
    discovery/                 Course Discovery cards/rows
    checkout/                  Payment method + order summary cards
    player/                    CurriculumSidebar, QuizPanel, QuizProgressCard
    learner/                   ToolkitsSection
  pages/
    SignUpPage.jsx, LoginPage.jsx
    CourseDiscoveryPage.jsx    Search, category filters, course rows
    CourseDetailPage.jsx       Course preview, price, "what you'll learn"
    CheckoutPage.jsx           3-step checkout (payment method is UI-only)
    CoursePlayerPage.jsx       Lesson video/content + knowledge-check quiz
    CertificatePage.jsx        Downloadable certificate (PDF/PNG) + QR code
    VerifyCertificatePage.jsx  Public /verify/:certId lookup
    LearnerHubPage.jsx         "My Learning" — in-progress courses, Toolkits
    CertificatesListPage.jsx   All earned certificates
  data/                       categories.js, toolkits.js
scripts/
  seed.mjs                    Firestore seed script
  generate-toolkit-pdf.mjs    Regenerates public/toolkits/*.pdf
docs/firestore-schema.md      Schema + security rules reference
design/                       Reference screenshots + tokens.md
DEMO.md                       Click-path for a live walkthrough
```

## Status

Everything in the demo loop is built: sign-up/login, Course Discovery,
Course Detail, Checkout (UI-only payment), the Course Player with
per-lesson knowledge-check quizzes (wrong answers retry immediately; must
pass to unlock the next lesson), progress tracking, downloadable
certificates with QR-code verification, and the Learner Hub ("My Learning"
+ Certificates + Toolkits).

Intentionally out of scope for this prototype: Tutor accounts, Saved
courses, Messages, streak/goals widgets, and notifications — each shows an
honest "coming soon" message rather than fake data.
