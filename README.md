# SkillBridge

Vocational learning hub prototype for youth and ag-entrepreneurs — course
browsing, video/audio lessons, quizzes, and certificates. Part of the larger
AgriBridge app; this repo builds the SkillBridge ("Learn Hub") piece only.

Built with React + Vite, Tailwind CSS, React Router, and Firebase
(Auth + Firestore + Storage). Layout is a responsive web app constrained to a
mobile-frame width (~390px), matching the Figma design in `/design`.

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a Firebase project** at [console.firebase.google.com](https://console.firebase.google.com):
   - Enable **Authentication** → Email/Password and Anonymous sign-in methods.
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
  lib/firebase.js         Firebase app/auth/firestore/storage init
  context/AuthContext.jsx Email + anonymous auth
  components/             Shared UI (MobileShell, ProtectedRoute, learn/*)
  pages/                  SignInPage, LearnHubPage
  data/categories.js      The 4 Learn Hub category filters
scripts/seed.mjs          Firestore seed script
docs/firestore-schema.md  Schema + category-mapping + security rules
design/                   Reference screenshots + tokens.md (design tokens)
```

## Status

Phase 1 (this phase): sign-in, Learn Hub (dashboard header placeholders,
category tabs, course list with 1 real course + 8 "Coming Soon" cards).

Not yet built: course player, quizzes, certificates.
