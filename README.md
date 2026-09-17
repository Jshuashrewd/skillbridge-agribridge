# SkillBridge

Vocational learning hub prototype for youth and ag-entrepreneurs — course
browsing, video/audio lessons, quizzes, and certificates. Part of the larger
AgriBridge app; this repo builds the SkillBridge piece only.

Built with React + Vite, Tailwind CSS, React Router, and Firebase
(Auth + Firestore + Storage). Layout is a responsive web app constrained to a
mobile-frame width (~390px), matching the Figma design in `/design`.

`/design` has two distinct screens that are easy to conflate — they are
separate routes here and should stay that way:

- **Course Discovery** (`03 · Course Discovery.png`, route `/discover`) — the
  public browsing/marketplace view: search, category filters, course rows
  (Popular / Recommended / Trending).
- **Learner Hub** (`05 · Learner Hub.png`) — the signed-in learner's personal
  dashboard ("My Learning", certificates, stats). **Not built yet.**

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a Firebase project** at [console.firebase.google.com](https://console.firebase.google.com):
   - Enable **Authentication** → Email/Password and Google sign-in methods.
   - Enable **Firestore Database** (start in test mode, or apply the rules in
     `docs/firestore-schema.md`).
   - Enable **Storage** (only needed once real lesson media is uploaded).
   - Copy your web app's Firebase config into `.env` (copy `.env.example`
     first).

3. **Run the dev server**

   ```bash
   npm run dev
   ```

4. **Seed Firestore** with the course catalog (1 full course, 8 placeholders):

   ```bash
   npm run seed
   ```

   See `docs/firestore-schema.md` for the full schema and the
   category-mapping assumptions used when seeding.

## Structure

```
src/
  lib/firebase.js           Firebase app/auth/firestore/storage init
  context/AuthContext.jsx   Email/password + Google auth, role assignment
  components/               Shared UI (MobileShell, ProtectedRoute, Toast,
                             RoleCard, SignUpStepper, discovery/*)
  pages/
    SignUpPage.jsx           3-step wizard: create account → role → verify
    LoginPage.jsx             Log in (Google or email/password)
    CourseDiscoveryPage.jsx   Search, category filters, course rows
  data/categories.js        The 4 category filters
scripts/seed.mjs            Firestore seed script
docs/firestore-schema.md    Schema + category-mapping + security rules
design/                     Reference screenshots + tokens.md (design tokens)
```

## Status

Sign-up (email or Google, Learner/Tutor role picker — only Learner works,
Tutor shows a "coming soon" message, forgot-password is skipped, email
verification is a fake pass-through screen), login, and Course Discovery
(course rows pulling from Firestore) are built.

Course Discovery's "Popular / Recommended / Trending" rows use a placeholder
heuristic since there's no real usage data yet (see the comment in
`CourseDiscoveryPage.jsx`) — swap in real signals once they exist.

Not yet built: Learner Hub dashboard, course player, quizzes, certificates.
