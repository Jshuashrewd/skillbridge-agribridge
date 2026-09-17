# SkillBridge Firestore Schema (Phase 1)

Covers courses, lessons, quizzes, and user progress for the Learn Hub prototype.
Quizzes are modeled here but not seeded/used yet (course player + quizzes are
next phase, per the task brief).

## `courses/{courseId}`

One document per course. Denormalizes `lessonCount` so the Learn Hub list can
render from this collection alone, without reading subcollections.

| Field | Type | Notes |
|---|---|---|
| `code` | string | Curriculum course number, e.g. `"201"` |
| `track` | string | `"track-1"` \| `"track-2"` \| `"track-3"` |
| `trackTitle` | string | e.g. `"Digital Literacy & Applied Tech Skills for Youth"` |
| `category` | string | One of the 4 Learn Hub filter keys (see below) |
| `title` | string | e.g. `"Smartphone Essentials & Digital Communication"` |
| `description` | string | Short course summary |
| `status` | string | `"published"` \| `"coming_soon"` |
| `order` | number | Sort key (curriculum course number as int, e.g. `201`) |
| `lessonCount` | number | Denormalized count of lessons |
| `coverImageUrl` | string \| null | Storage URL; `null` for placeholders |
| `createdAt` / `updatedAt` | timestamp | |

Doc id convention: `course-{code}` (e.g. `course-201`).

### Category mapping (assumption — flag if wrong)

The spec's 4 Learn Hub categories don't line up 1:1 with the 3 curriculum
tracks, so Track 3 is split by topic:

| Category key | Label | Courses |
|---|---|---|
| `ag-tech-skills` | Ag-Tech Skills | 101, 102, 103 (Track 1) |
| `digital-tech-literacy` | Digital & Tech Literacy | 201, 202, 203 (Track 2) |
| `financial-inclusion` | Financial Inclusion | 301 (Budgeting, Cash Flow & Micro-Credit) |
| `youth-entrepreneurship` | Youth Entrepreneurship | 302 (Digital Marketing), 303 (Grant Pitching) |

## `courses/{courseId}/lessons/{lessonId}`

Subcollection, one document per lesson.

| Field | Type | Notes |
|---|---|---|
| `courseId` | string | Redundant back-reference, useful for `collectionGroup` queries |
| `order` | number | Position within the course, 1-indexed |
| `title` | string | |
| `type` | string | `"video"` \| `"audio"` \| `"text"` |
| `mediaUrl` | string \| null | Storage URL; `null` until real media is uploaded |
| `durationSeconds` | number | |
| `content` | string | Lesson body/transcript — real text is seeded even where `mediaUrl` is null |
| `createdAt` / `updatedAt` | timestamp | |

Doc id convention: `lesson-{n}` (1-indexed within the course).

## `courses/{courseId}/lessons/{lessonId}/quizzes/{quizId}`

Subcollection (modeled now, **not seeded this phase**). One knowledge-check
per lesson in practice, but kept as a collection in case a lesson ever needs
more than one.

| Field | Type | Notes |
|---|---|---|
| `lessonId` | string | Back-reference |
| `passScore` | number | Minimum correct answers to pass |
| `questions` | array\<object\> | `{ id, prompt, choices: string[], correctIndex: number }` |
| `createdAt` / `updatedAt` | timestamp | |

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

Subcollection, one doc per course the user has started.

| Field | Type | Notes |
|---|---|---|
| `courseId` | string | Back-reference |
| `status` | string | `"not_started"` \| `"in_progress"` \| `"completed"` |
| `completedLessonIds` | array\<string\> | |
| `lastLessonId` | string \| null | For "continue where you left off" |
| `startedAt` / `completedAt` / `updatedAt` | timestamp \| null | |

## Firestore security rules (for this prototype week)

Not enforced yet. Suggested minimal rule for the demo period — any signed-in
user (including anonymous) can read/write their own data and read courses;
only writes to `courses`/`lessons` are left open too so the seed script can
run without a service account:

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
        match /quizzes/{quizId} {
          allow read, write: if request.auth != null;
        }
      }
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /progress/{courseId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

Tighten before any real launch — this is intentionally open for a one-week
prototype.
