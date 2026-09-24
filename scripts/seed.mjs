// Seeds Firestore with the SkillBridge catalog shown in the Figma Course
// Discovery design (node 79:608): one fully-built course (course-101, UI/UX
// Design Fundamentals — lesson titles, order, and durations match the
// Course Preview modal, node 81:727) plus 7 "coming soon" placeholders
// matching the other course cards shown on that screen.
//
// Requires a Firebase project configured in .env (see .env.example) with
// Firestore created in test mode (or rules that allow unauthenticated
// writes to `courses` — this script does not sign in). Run with:
//
//   node --env-file=.env scripts/seed.mjs

import { initializeApp } from 'firebase/app'
import { doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

const missing = Object.entries(firebaseConfig).filter(([, value]) => !value)
if (missing.length) {
  console.error(
    `Missing env vars: ${missing.map(([key]) => key).join(', ')}\n` +
      'Copy .env.example to .env, fill in your Firebase project config, and run:\n' +
      '  node --env-file=.env scripts/seed.mjs',
  )
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// The one fully-built course this phase (course-101, UI/UX Design
// Fundamentals). Lesson titles, order, and durations match the Course
// Preview modal in the Figma file (node 81:727) exactly.
const uiUxFundamentalsLessons = [
  {
    id: 'lesson-1',
    order: 1,
    module: 'Foundations',
    moduleOrder: 1,
    title: 'Course Introduction',
    type: 'video',
    mediaUrl: null,
    durationSeconds: 150,
    content:
      "A quick tour of what this course covers and how it's structured: you'll move " +
      'from foundational UX/UI concepts through user research and into hands-on ' +
      "wireframing, finishing with a portfolio-ready project. Each lesson pairs a " +
      'short video with a knowledge check, and unlocks the next lesson once you pass it.',
    objectives: [
      "Understand what you'll build by the end of this course",
      'Know how lessons, knowledge checks, and unlocking work',
      'Identify the four stages the course moves through',
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          prompt: "What do you need to complete before the next lesson unlocks?",
          choices: ['Watch the video twice', "Pass the lesson's knowledge check", 'Leave a review', 'Download the course PDF'],
          correctIndex: 1,
        },
        {
          id: 'q2',
          prompt: 'What will you have by the end of this course?',
          choices: ['A completed portfolio-ready project', 'A UX certification exam', 'A Figma subscription', 'A list of design tools only'],
          correctIndex: 0,
        },
        {
          id: 'q3',
          prompt: 'How is each lesson structured?',
          choices: ['A video followed by a knowledge check', 'A live class only', 'A reading list with no video', 'A group project'],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    id: 'lesson-2',
    order: 2,
    module: 'Foundations',
    moduleOrder: 1,
    title: 'What is UI/UX Design?',
    type: 'video',
    mediaUrl: null,
    durationSeconds: 252,
    content:
      'UX (user experience) and UI (user interface) design are related but different ' +
      'disciplines. UX is concerned with how a product works — the flow, the logic, ' +
      'whether people can actually get things done. UI is concerned with how a ' +
      'product looks and feels — layout, color, typography, and the small ' +
      'interactive details. Good products need both: a well-researched, logical ' +
      'flow expressed through a clear, consistent visual interface.',
    objectives: [
      'Explain the difference between UX and UI design',
      'Recognize why a product needs both to succeed',
      'Identify UX vs UI concerns in a real screen',
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          prompt: 'Which best describes UX design?',
          choices: ['How a product looks visually', 'How a product works and flows for the user', 'The color palette of an app', 'The font used in a logo'],
          correctIndex: 1,
        },
        {
          id: 'q2',
          prompt: 'Which best describes UI design?',
          choices: ['The visual layout, color, and typography of a product', 'The backend database structure', "The user's emotional journey only", 'The marketing copy'],
          correctIndex: 0,
        },
        {
          id: 'q3',
          prompt: 'Why does a product need both UX and UI?',
          choices: [
            'A logical flow alone always guarantees success',
            'A beautiful interface can fix a confusing flow',
            'Users notice looks first and never notice structure',
            'A confusing flow with a clear interface still frustrates users',
          ],
          correctIndex: 3,
        },
      ],
    },
  },
  {
    id: 'lesson-3',
    order: 3,
    module: 'Foundations',
    moduleOrder: 1,
    title: 'The Design Process',
    type: 'video',
    mediaUrl: null,
    durationSeconds: 378,
    content:
      'Professional design work follows a repeatable process, often described as ' +
      'four stages: Discover (research the problem), Define (frame the right ' +
      'problem to solve), Develop (explore and prototype solutions), and Deliver ' +
      '(test, refine, and ship). Designers move through these stages iteratively — ' +
      'testing early ideas with real users and looping back to earlier stages when ' +
      'research reveals a better problem to solve.',
    objectives: [
      'Name the four stages of the design process',
      'Explain why the process is iterative, not linear',
      'Describe what happens at each stage',
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          prompt: 'What are the four stages of the design process covered in this lesson?',
          choices: ['Discover, Define, Develop, Deliver', 'Plan, Build, Test, Launch', 'Research, Design, Code, Deploy', 'Sketch, Draw, Paint, Present'],
          correctIndex: 0,
        },
        {
          id: 'q2',
          prompt: 'Why is the design process iterative?',
          choices: [
            'Because clients change their minds constantly',
            'Because testing early ideas often reveals a better problem to solve',
            'Because designers must repeat the same wireframe five times',
            'Because each stage takes exactly one week',
          ],
          correctIndex: 1,
        },
        {
          id: 'q3',
          prompt: 'At which stage would you conduct user interviews?',
          choices: ['Deliver', 'Develop', 'Discover', 'Define only'],
          correctIndex: 2,
        },
      ],
    },
  },
  {
    id: 'lesson-4',
    order: 4,
    module: 'Research & Design',
    moduleOrder: 2,
    title: 'User Research Basics',
    type: 'video',
    mediaUrl: null,
    durationSeconds: 324,
    content:
      "Good design starts with understanding real users, not assumptions. This " +
      'lesson covers the basics of user research: writing interview questions that ' +
      'surface genuine needs rather than leading the user, synthesizing what you ' +
      'learn into personas — fictional but research-based profiles representing key ' +
      'user groups — and using empathy maps to capture what users think, feel, say, ' +
      'and do.',
    objectives: [
      'Write open-ended interview questions that avoid leading the user',
      'Build a simple user persona from research notes',
      'Use an empathy map to organize research findings',
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          prompt: "What's a leading question to avoid in a user interview?",
          choices: [
            '"Walk me through the last time you did this."',
            '"Don\'t you think this feature would be great?"',
            '"What was frustrating about that experience?"',
            '"Can you show me how you currently solve this?"',
          ],
          correctIndex: 1,
        },
        {
          id: 'q2',
          prompt: 'A user persona is best described as...',
          choices: ["A real person's exact profile", 'A fictional profile grounded in real research, representing a user group', 'A marketing target list', 'A wireframe of the login screen'],
          correctIndex: 1,
        },
        {
          id: 'q3',
          prompt: 'An empathy map typically captures what a user...',
          choices: ['Thinks, feels, says, and does', 'Bought, returned, and rated', 'Coded, tested, and shipped', 'Designed, drew, and presented'],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    id: 'lesson-5',
    order: 5,
    module: 'Research & Design',
    moduleOrder: 2,
    title: 'Wireframing in Practice',
    type: 'video',
    mediaUrl: null,
    durationSeconds: 426,
    content:
      "Wireframes are low-fidelity sketches of a screen's layout and structure, used " +
      'to test ideas quickly before investing in visual design. This lesson walks ' +
      'through building a wireframe from a user flow: starting with rough boxes and ' +
      'labels, then adding just enough detail to communicate hierarchy and ' +
      'interaction — without getting distracted by color or type choices, which ' +
      'come later in high-fidelity design.',
    objectives: [
      'Explain the difference between low-fidelity and high-fidelity wireframes',
      'Turn a user flow into a basic wireframe layout',
      'Know when to move from wireframes to high-fidelity design',
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          prompt: 'What is the main purpose of a low-fidelity wireframe?',
          choices: ['To finalize brand colors', 'To test layout and structure quickly before visual design', 'To write production code', 'To replace user research'],
          correctIndex: 1,
        },
        {
          id: 'q2',
          prompt: 'Which should you generally avoid focusing on in a wireframe?',
          choices: ['Layout and hierarchy', 'Screen flow', 'Color and typography detail', 'Where buttons are placed'],
          correctIndex: 2,
        },
        {
          id: 'q3',
          prompt: 'When should you typically move from wireframes to high-fidelity design?',
          choices: ['Immediately, skipping wireframes entirely', 'Once the layout and flow have been validated', 'Only after the product has launched', 'Never — wireframes replace final designs'],
          correctIndex: 1,
        },
      ],
    },
  },
]

const COURSES = [
  {
    id: 'course-101',
    code: '101',
    category: 'ui-ux-design',
    title: 'UI/UX Design Fundamentals',
    description:
      'Learn the core principles of user experience and interface design, and build ' +
      'real-world projects.',
    status: 'published',
    order: 101,
    coverImageUrl: null,
    price: 24000,
    compareAtPrice: 32000,
    rating: 4.8,
    reviewCount: 324,
    learnerCount: 24300,
    level: 'Beginner',
    learningOutcomes: [
      'Understand UX/UI principles and design processes',
      'Create user personas and conduct user research',
      'Design high-fidelity wireframes and interactive prototypes',
      'Build a complete end-to-end project for your portfolio',
    ],
    includes: [
      '30-day money-back guarantee',
      'Full lifetime access',
      'Access on all devices',
      'Certificate of completion',
      'Downloadable resources',
    ],
    instructorName: 'Esther Akinyemi',
    instructorTitle: 'Product Designer · Design Educator',
    instructorBio:
      'Esther has spent her career designing products and teaching the next generation ' +
      'of designers practical, portfolio-ready UX/UI skills.',
    lessons: uiUxFundamentalsLessons,
  },
  {
    id: 'course-102',
    code: '102',
    category: 'ui-ux-design',
    title: 'Figma for Product Designers',
    instructorName: 'Abdul Singh',
    rating: 4.8,
    description: 'Coming soon.',
    status: 'coming_soon',
    order: 102,
    coverImageUrl: null,
    lessons: [],
  },
  {
    id: 'course-103',
    code: '103',
    category: 'business',
    title: 'Product Management Essentials',
    instructorName: 'Daniel Okafor',
    rating: 4.7,
    learnerCount: 16800,
    description: 'Coming soon.',
    status: 'coming_soon',
    order: 103,
    coverImageUrl: null,
    lessons: [],
  },
  {
    id: 'course-104',
    code: '104',
    category: 'business',
    title: 'Digital Marketing Strategy',
    instructorName: 'Amara Bello',
    rating: 4.6,
    learnerCount: 13400,
    description: 'Coming soon.',
    status: 'coming_soon',
    order: 104,
    coverImageUrl: null,
    lessons: [],
  },
  {
    id: 'course-105',
    code: '105',
    category: 'technology',
    title: 'Web Development with JavaScript',
    instructorName: 'Tunde Salami',
    rating: 4.9,
    learnerCount: 28700,
    description: 'Coming soon.',
    status: 'coming_soon',
    order: 105,
    coverImageUrl: null,
    lessons: [],
  },
  {
    id: 'course-106',
    code: '106',
    category: 'technology',
    title: 'Data Analysis with Python',
    rating: 4.7,
    description: 'Coming soon.',
    status: 'coming_soon',
    order: 106,
    coverImageUrl: null,
    lessons: [],
  },
  {
    id: 'course-107',
    code: '107',
    category: 'business',
    title: 'Effective Communication',
    rating: 4.8,
    description: 'Coming soon.',
    status: 'coming_soon',
    order: 107,
    coverImageUrl: null,
    lessons: [],
  },
  {
    id: 'course-108',
    code: '108',
    category: 'technology',
    title: 'AI Tools for Creators',
    rating: 4.7,
    description: 'Coming soon.',
    status: 'coming_soon',
    order: 108,
    coverImageUrl: null,
    lessons: [],
  },
]

async function run() {
  for (const { lessons, ...course } of COURSES) {
    await setDoc(doc(db, 'courses', course.id), {
      ...course,
      lessonCount: lessons.length,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    console.log(`✔ course ${course.id} (${course.status})`)

    for (const { id: lessonId, ...lesson } of lessons) {
      await setDoc(doc(db, 'courses', course.id, 'lessons', lessonId), {
        ...lesson,
        courseId: course.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      console.log(`  ✔ ${lessonId}: ${lesson.title}`)
    }
  }

  console.log('\nSeed complete.')
  process.exit(0)
}

run().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
