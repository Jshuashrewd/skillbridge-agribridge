# SkillBridge — Live Demo Script

Live URL: **https://skillbridge-agribridge.web.app**

Two ways to demo, depending on how much time you have.

---

## Full walkthrough (~6–8 min) — shows the whole journey live

Use a fresh email each time (any `you+anything@example.com` works — no real
email is ever sent). Everything below is real: real Firestore writes, real
PDF/PNG/QR generation, real quiz logic. The only things that are
intentionally fake are payment processing and video playback — both are
called out explicitly in the product copy itself, so nothing looks broken.

1. **Sign up** — `Sign up` → fill in name/email/password → **Create
   account**.
2. **Role picker** — pick **I'm a Learner** → **Continue**. (If you click
   *I'm a Tutor* first, it shows an honest "coming soon" toast and doesn't
   advance — a nice aside if asked "what about tutors?")
3. **Email verification** — this screen is a deliberate no-op for the demo:
   click **Verify email** to continue (no real email is sent).
4. **Browse** — you land on **Discover**. Point out the search bar and
   category filter chips. Click into **UI/UX Design Fundamentals**.
5. **Course Detail** — scroll to show "What you'll learn," the lesson list,
   and the instructor block. Click **Enroll now**.
6. **Checkout** — pick any payment method (**Bank Transfer** has no fields
   to fill, fastest for a demo). Click through **Continue to payment** →
   **Continue to review** → check the Terms box → **Confirm and pay**. The
   success modal appears immediately — call out that this is intentionally
   a fake gateway (no Paystack/Flutterwave), any method always "succeeds."
7. **Start learning** — lands in the **Course Player**: video area,
   instructor row, overall progress bar, and the **Contents** sidebar with
   lesson 1 unlocked and lessons 2–4 shown locked (lock icon).
8. **Knowledge check** — click **Take knowledge check**. On question 1,
   deliberately pick a **wrong** answer and click **Check answer** — it
   turns red with "Not quite — pick another answer and try again," and lets
   you retry immediately, no penalty. Pick the right answer, watch the
   sidebar's quiz-progress bar move, finish all 3 questions.
9. **Lesson unlocks** — the "Lesson complete!" panel appears; click
   **Continue to [next lesson]** and note lesson 2 is now unlocked in the
   sidebar (dark green circle). Repeat lessons 2–4 (can go faster — just
   click through the quiz answers, wrong-answer retry doesn't need
   repeating every time).
10. **Certificate** — finishing lesson 4's quiz routes straight to the
    **Certificate** page: trophy, "Course complete!", then the certificate
    card itself — learner name, course title, date, unique certificate ID,
    and a real QR code. Click **Download PNG** or **Download PDF** to show
    it's a real file, not a mockup.
11. **Verify** — click the `/verify/:certId` link on the certificate page
    (or open it in a new tab) — **Certificate found**, with the same
    details, no login required. This is the public verification page
    anyone (e.g. an employer) could check.
12. **Learner Hub** — click **Go to my certificates**, or **Certificates**
    in the sidebar/bottom nav: shows the earned certificate with **View
    certificate** and **Copy link** actions. Click **My Learning** in the
    nav: stat tiles (real counts, not fake data), an honest "You've
    completed every course you're enrolled in" message (since there's only
    the one real course right now), and the **Toolkits** section — one real
    downloadable PDF (Mobile Money Safety Checklist, content drawn straight
    from Lesson 2) plus three "Coming Soon" resources named after real
    upcoming curriculum tracks.

---

## Fast path (~90 sec) — skip straight to the payoff

A pre-completed demo account is already seeded in Firestore, so you can
jump straight to the Learner Hub / Certificate without re-running the whole
quiz flow. Useful if you're short on time or want to open on the "wow"
moment before rewinding to show how it was earned.

- **Login**: `demo@skillbridge.ng` / `SkillBridgeDemo1!`
- Lands on Discover → click **My Learning** in the nav to go straight to a
  completed course + earned certificate + Toolkits.
- Click **Certificates** → **View certificate** to show the downloadable
  certificate + QR code immediately.

---

## If something looks slow

Firestore reads occasionally take a beat longer than expected right after a
page load (network variance, not a bug) — if a list shows "Loading…" for a
couple of seconds, that's normal; give it a moment rather than refreshing.

## Things to say out loud if asked

- "The payment step is a fake gateway on purpose — the brief asked for the
  full UX without integrating Paystack/Flutterwave, so any payment method
  always succeeds."
- "Video playback is a styled placeholder — clicking it says so directly
  rather than pretending to be a real player."
- "Everything else here is real: real Firebase Auth accounts, real
  Firestore writes for enrollment/progress/certificates, a real generated
  PDF certificate with a real QR code, and a real public verification
  page."
