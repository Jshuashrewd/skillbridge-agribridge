# SkillBridge Firestore Schema

Covers courses, lessons, quizzes, user progress, and certificates for the
Course Player prototype.

## `courses/{courseId}`

One document per course. Denormalizes `lessonCount` so the Learn Hub list can
render from this collection alone, without reading subcollections.

| Field | Type | Notes |
|---|---|---|
| `code` | string | Catalog course number, e.g. `"101"` |
| `category` | string | One of the Course Discovery filter keys (see below) |
| `title` | string | e.g. `"UI/UX Design Fundamentals"` |
| `description` | string | Short course summary |
| `status` | string | `"published"` \| `"coming_soon"` |
| `order` | number | Sort key (catalog course number as int, e.g. `101`) |
| `lessonCount` | number | Denormalized count of lessons |
| `coverImageUrl` | string \| null | Storage URL; `null` for placeholders |
| `price` | number \| undefined | Naira. Only set on enrollable (`"published"`) courses |
| `compareAtPrice` | number \| undefined | Pre-discount price shown struck through; only set alongside `price` |
| `rating` | number \| undefined | Shown as `★ rating` on discovery cards and Course Detail |
| `reviewCount` | number \| undefined | e.g. `324` → "4.8 (324 reviews)" on Course Detail; only set on the one course with real reviews context |
| `learnerCount` | number \| undefined | Shown as "N learners" on discovery cards |
| `level` | string \| undefined | e.g. `"Beginner"`; shown on Course Detail |
| `learningOutcomes` | array\<string\> \| undefined | "What you'll learn" bullets on Course Detail; derived from real lesson content, not filler |
| `includes` | array\<string\> \| undefined | "This course includes" bullets on Course Detail |
| `instructorName` / `instructorTitle` / `instructorBio` | string \| undefined | Shown in the Course Detail instructor block |
| `createdAt` / `updatedAt` | timestamp | |

Doc id convention: `course-{code}` (e.g. `course-101`).

### Category mapping

Matches the filter chips on the Figma Course Discovery screen (node 79:608),
extended with two categories (`business`, `technology`) since several of
that screen's own course cards (Product Management, Digital Marketing, Web
Development, Data Analysis, AI Tools) don't fit any of Figma's 5 shown
chips (UI/UX Design, Graphic Design, 3D & Animation, Photography, Branding —
Figma's mockup itself has no course under the latter 3):

| Category key | Label | Courses |
|---|---|---|
| `ui-ux-design` | UI/UX Design | 101 (UI/UX Design Fundamentals), 102 (Figma for Product Designers) |
| `graphic-design` | Graphic Design | none yet |
| `3d-animation` | 3D & Animation | none yet |
| `photography` | Photography | none yet |
| `branding` | Branding | none yet |
| `business` | Business & Marketing | 103 (Product Management), 104 (Digital Marketing), 107 (Effective Communication) |
| `technology` | Technology | 105 (Web Development), 106 (Data Analysis), 108 (AI Tools) |

## `courses/{courseId}/lessons/{lessonId}`

Subcollection, one document per lesson.

| Field | Type | Notes |
|---|---|---|
| `courseId` | string | Redundant back-reference, useful for `collectionGroup` queries |
| `order` | number | Position within the course, 1-indexed. The course player unlocks lesson `n` once lesson `n-1` is completed |
| `module` | string | Curriculum sidebar section heading, e.g. `"Foundations"` |
| `moduleOrder` | number | Sort key for modules |
| `title` | string | |
| `type` | string | `"video"` \| `"audio"` \| `"text"` |
| `mediaUrl` | string \| null | Storage URL; `null` until real media is uploaded — the player shows a static placeholder in that case, it doesn't fake playback |
| `durationSeconds` | number | |
| `content` | string | Lesson body/transcript, shown on the Overview tab |
| `objectives` | array\<string\> | "What you'll learn in this lesson" checklist on the Overview tab |
| `quiz.questions` | array\<object\> | Knowledge-check questions: `{ id, prompt, choices: string[], correctIndex: number }`. Embedded directly on the lesson doc rather than a subcollection — each lesson has exactly one knowledge check in this prototype, and it's always read together with the lesson |
| `createdAt` / `updatedAt` | timestamp | |

Doc id convention: `lesson-{n}` (1-indexed within the course).

### Knowledge-check mechanics (Course Player)

A lesson's quiz has no separate "pass score" — every question must be
answered correctly at least once to complete the lesson. Wrong answers show
inline feedback and can be retried immediately, with no lockout or penalty.
Completing the last lesson's quiz marks the course `completed` and mints a
certificate (see below).

## `users/{userId}`

Doc id = Firebase Auth UID. Created on first sign-in (email/password or Google).

| Field | Type | Notes |
|---|---|---|
| `email` | string \| null | |
| `displayName` | string \| null | |
| `isAnonymous` | boolean | Always `false` now — anonymous/guest sign-in was removed when the sign-up flow was rebuilt to match the design (Learner/Tutor role picker requires a real account) |
| `role` | string \| null | `"learner"` \| `"tutor"` \| `null` until the "Tell us about you" step is completed. Only `"learner"` is functional this phase — selecting Tutor shows a "coming soon" message and does not set this field |
| `streakCount` | number | Placeholder, defaults to `0` — not wired up yet |
| `badges` | array\<string\> | Placeholder, defaults to `[]` — not wired up yet |
| `createdAt` | timestamp | |

## `users/{userId}/progress/{courseId}`

Subcollection, one doc per course the user has started. Created on first
visit to the Course Player (`touchProgress`), updated when a lesson's
knowledge check is passed (`completeLesson`) — see `src/lib/progress.js`.

| Field | Type | Notes |
|---|---|---|
| `courseId` | string | Back-reference |
| `status` | string | `"in_progress"` \| `"completed"` |
| `completedLessonIds` | array\<string\> | Lesson ids whose knowledge check has been passed |
| `lastLessonId` | string \| null | Last lesson viewed; also used to resume `/course/:courseId/learn` |
| `certificateId` | string \| null | Set once, the first time `completedLessonIds.length` reaches the lesson count — see `certificates` below |
| `startedAt` / `completedAt` / `updatedAt` | timestamp \| null | |

## `certificates/{certId}`

Top-level collection, one doc per certificate issued. Publicly readable so
`/verify/:certId` works without authentication. Written once per
course-completion by `src/lib/certificate.js` (`issueCertificate`), which is
idempotent — it checks `progress.certificateId` first rather than minting a
duplicate on repeat visits.

| Field | Type | Notes |
|---|---|---|
| `certId` | string | Doc id, format `SB-{courseCode}-{8-char id}`, e.g. `SB-201-4F2A9C1B` |
| `userId` | string | Firebase Auth UID of the learner |
| `userName` | string | Denormalized display name (or email if no display name) at time of issue |
| `courseId` / `courseTitle` | string | Denormalized |
| `issuedAt` | timestamp | |

The Certificate page (`/course/:courseId/certificate`) renders this as a
downloadable card (PNG via `html2canvas`, PDF via `jspdf`) with a QR code
(via the `qrcode` package) encoding the `/verify/:certId` URL. Verification
itself is a placeholder — it's a direct client read of this collection, no
separate verification backend.

## `users/{userId}/enrollments/{courseId}`

Subcollection, one doc per course the user has paid for (doc id = `courseId`,
so a user can't double-enroll in the same course). Written by the checkout
flow on "payment" success — the payment itself is UI-only (no real gateway;
any payment method/button press succeeds).

| Field | Type | Notes |
|---|---|---|
| `courseId` | string | Back-reference |
| `courseTitle` | string | Denormalized for display without an extra read |
| `price` | number | Amount "paid", in Naira |
| `paymentMethod` | string | `"card"` \| `"bank_transfer"` \| `"ussd"` |
| `status` | string | `"active"` |
| `enrolledAt` | timestamp | |

## Firestore security rules (for this prototype week)

Live at `firestore.rules` in the repo root (deployed via `firebase deploy`
or `firebase deploy --only firestore:rules`) — this is the same content
below, kept in sync manually. Any signed-in user can read/write their own
data and read courses; only writes to `courses`/`lessons` are left open too
so the seed script can run without a service account:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null;
      match /lessons/{lessonId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /progress/{courseId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      match /enrollments/{courseId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    match /certificates/{certId} {
      allow read: if true; // powers the public /verify/:certId page
      allow create: if request.auth != null;
    }
  }
}
```

Tighten before any real launch — this is intentionally open for a one-week
prototype.
