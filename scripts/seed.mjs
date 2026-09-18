// Seeds Firestore with the SkillBridge curriculum: one fully-built course
// (201, Smartphone Essentials) plus 8 "coming soon" placeholders.
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

// Track 2 / Course 201 — the one fully-built course this phase.
const smartphoneEssentialsLessons = [
  {
    id: 'lesson-1',
    order: 1,
    module: 'Phone Basics',
    moduleOrder: 1,
    title: 'Getting to Know Your Smartphone',
    type: 'video',
    mediaUrl: null,
    durationSeconds: 360,
    content:
      'Learn the parts of your smartphone that matter most day to day: home screen ' +
      'and app icons, storage and clearing space, battery care, and connecting to ' +
      'Wi-Fi or mobile data. By the end of this lesson you should be able to check ' +
      'your storage, connect to a new Wi-Fi network, and know which settings menu ' +
      'to use when something needs adjusting.',
    objectives: [
      "Check how much storage you have free",
      'Connect to a new Wi-Fi network',
      'Know which settings menu to use for common adjustments',
      "Care for your phone's battery day to day",
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          prompt: 'Where would you go to see how much storage space is free on your phone?',
          choices: ['Settings', 'Camera app', 'Contacts', 'Calculator'],
          correctIndex: 0,
        },
        {
          id: 'q2',
          prompt: 'What do you need to connect your phone to a new Wi-Fi network?',
          choices: [
            "The network's name and password",
            'Your SIM card PIN',
            'A USB cable',
            "The phone's IMEI number",
          ],
          correctIndex: 0,
        },
        {
          id: 'q3',
          prompt: "Which of these helps protect your phone's battery over time?",
          choices: [
            'Always charging to exactly 100% overnight, every night',
            'Avoiding extreme heat and very low charge levels',
            'Using it while charging as much as possible',
            'Removing the battery when not in use',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    id: 'lesson-2',
    order: 2,
    module: 'Phone Basics',
    moduleOrder: 1,
    title: 'Calls, SMS & Mobile Money Basics',
    type: 'video',
    mediaUrl: null,
    durationSeconds: 420,
    content:
      'Covers making and receiving calls, sending SMS, and using USSD codes — the ' +
      'short dial codes (like *737#) used for mobile money transfers, airtime, and ' +
      'checking your balance. Includes a walkthrough of a typical mobile money ' +
      'transfer and what to double-check before confirming a transaction.',
    objectives: [
      'Make and receive calls and SMS confidently',
      'Use USSD codes like *737# for mobile money and airtime',
      'Complete a mobile money transfer step by step',
      'Know what to double-check before confirming a transaction',
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          prompt: 'USSD codes like *737# are mainly used for...',
          choices: [
            'Downloading apps',
            'Mobile money, airtime, and balance checks',
            "Changing your phone's language",
            'Connecting to Wi-Fi',
          ],
          correctIndex: 1,
        },
        {
          id: 'q2',
          prompt: 'Before confirming a mobile money transfer, you should always...',
          choices: [
            'Turn off your phone',
            "Double-check the recipient's number and the amount",
            'Delete the SMS',
            'Restart the app',
          ],
          correctIndex: 1,
        },
        {
          id: 'q3',
          prompt: 'Which of these helps make sure a call or SMS goes through correctly?',
          choices: [
            'Confirming you have network signal and the right number',
            'Using airplane mode',
            'Clearing your call log first',
            'Muting notifications',
          ],
          correctIndex: 0,
        },
      ],
    },
  },
  {
    id: 'lesson-3',
    order: 3,
    module: 'Communication & Safety',
    moduleOrder: 2,
    title: 'Messaging & Email for Work',
    type: 'video',
    mediaUrl: null,
    durationSeconds: 400,
    content:
      'Introduces WhatsApp for business communication — group etiquette, sharing ' +
      'photos/documents, and voice notes for low-literacy contexts — alongside the ' +
      'basics of writing a clear, professional email: subject lines, greetings, and ' +
      'attachments.',
    objectives: [
      'Use WhatsApp groups professionally',
      'Share photos, documents, and voice notes appropriately',
      'Write a clear subject line and greeting',
      'Send an email with an attachment',
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          prompt: 'In a WhatsApp work group, which is the better etiquette?',
          choices: [
            'Sending many short one-word messages back to back',
            "Keeping messages clear and relevant to the group's purpose",
            'Forwarding every message you receive',
            'Turning off read receipts for everyone',
          ],
          correctIndex: 1,
        },
        {
          id: 'q2',
          prompt: 'A professional email should generally include...',
          choices: [
            'A clear subject line and a greeting',
            'No subject line, to save time',
            'Slang and abbreviations only',
            'A blank body with just an attachment',
          ],
          correctIndex: 0,
        },
        {
          id: 'q3',
          prompt: 'Voice notes are especially useful for...',
          choices: [
            'Sending large video files faster',
            'Low-literacy contexts where typing is difficult',
            'Replacing all typed messages permanently',
            'Hiding information from the recipient',
          ],
          correctIndex: 1,
        },
      ],
    },
  },
  {
    id: 'lesson-4',
    order: 4,
    module: 'Communication & Safety',
    moduleOrder: 2,
    title: 'Staying Safe Online',
    type: 'video',
    mediaUrl: null,
    durationSeconds: 380,
    content:
      'Practical digital safety: choosing a strong password/PIN, recognizing common ' +
      'phishing and scam messages (fake prize alerts, urgent "verify your account" ' +
      'texts), and what personal information to never share over the phone or SMS.',
    objectives: [
      'Choose a strong password or PIN',
      'Recognize phishing and scam messages',
      "Spot fake prize or urgent 'verify your account' texts",
      'Know what personal information to never share',
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          prompt: 'Which of these is a sign of a phishing message?',
          choices: [
            'It comes from a saved contact',
            "An urgent request to 'verify your account' with a suspicious link",
            'It has no attachments',
            'It was sent during business hours',
          ],
          correctIndex: 1,
        },
        {
          id: 'q2',
          prompt: 'What makes a password or PIN strong?',
          choices: [
            'Using your birth year',
            "Using '1234' for easy recall",
            'Making it long, unique, and not easily guessed',
            'Sharing it with close family so they can help if needed',
          ],
          correctIndex: 2,
        },
        {
          id: 'q3',
          prompt:
            "If you get an SMS saying you've won a prize and must reply with your bank PIN, you should...",
          choices: [
            'Reply immediately with your PIN',
            'Never share your PIN and treat the message as a scam',
            'Forward it to your contacts',
            'Call the number in the message to confirm',
          ],
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
    track: 'track-1',
    trackTitle: 'Digital Agronomy & Smart Field Operations',
    category: 'ag-tech-skills',
    title: 'Intro to Mobile Ag-Tech Tools & GPS Mapping',
    description: 'Coming soon.',
    status: 'coming_soon',
    order: 101,
    coverImageUrl: null,
    lessons: [],
  },
  {
    id: 'course-102',
    code: '102',
    track: 'track-1',
    trackTitle: 'Digital Agronomy & Smart Field Operations',
    category: 'ag-tech-skills',
    title: 'Reading Weather Analytics & Precision Planting Systems',
    description: 'Coming soon.',
    status: 'coming_soon',
    order: 102,
    coverImageUrl: null,
    lessons: [],
  },
  {
    id: 'course-103',
    code: '103',
    track: 'track-1',
    trackTitle: 'Digital Agronomy & Smart Field Operations',
    category: 'ag-tech-skills',
    title: 'Modern Field Data Collection & Digital Farm Auditing',
    description: 'Coming soon.',
    status: 'coming_soon',
    order: 103,
    coverImageUrl: null,
    lessons: [],
  },
  {
    id: 'course-201',
    code: '201',
    track: 'track-2',
    trackTitle: 'Digital Literacy & Applied Tech Skills for Youth',
    category: 'digital-tech-literacy',
    title: 'Smartphone Essentials & Digital Communication',
    description:
      'Get comfortable with your smartphone, mobile money, and everyday digital ' +
      'communication — the foundation for every other course on SkillBridge.',
    status: 'published',
    order: 201,
    coverImageUrl: null,
    price: 5000,
    compareAtPrice: 8000,
    learningOutcomes: [
      'Navigate your smartphone settings, storage, and connectivity with confidence',
      'Make calls, send SMS, and complete a mobile money transfer safely',
      'Communicate professionally over WhatsApp and email',
      'Recognize common phishing and scam messages and protect your personal information',
    ],
    includes: [
      '4 on-demand lessons',
      'Practical, real-world walkthroughs',
      'Certificate of completion',
      'Lifetime access',
    ],
    instructorName: 'SkillBridge Curriculum Team',
    instructorTitle: 'Digital Literacy Program',
    instructorBio:
      'Course content developed by the SkillBridge Digital Literacy program for ' +
      'youth and ag-entrepreneurs across the curriculum.',
    lessons: smartphoneEssentialsLessons,
  },
  {
    id: 'course-202',
    code: '202',
    track: 'track-2',
    trackTitle: 'Digital Literacy & Applied Tech Skills for Youth',
    category: 'digital-tech-literacy',
    title: 'Excel & Digital Spreadsheet Mastery for Inventory & Records',
    description: 'Coming soon.',
    status: 'coming_soon',
    order: 202,
    coverImageUrl: null,
    lessons: [],
  },
  {
    id: 'course-203',
    code: '203',
    track: 'track-2',
    trackTitle: 'Digital Literacy & Applied Tech Skills for Youth',
    category: 'digital-tech-literacy',
    title: 'Intro to Cloud Tools, Mobile Data Syncing, and Cyber Safety',
    description: 'Coming soon.',
    status: 'coming_soon',
    order: 203,
    coverImageUrl: null,
    lessons: [],
  },
  {
    id: 'course-301',
    code: '301',
    track: 'track-3',
    trackTitle: 'Ag-Entrepreneurship & Financial Literacy',
    category: 'financial-inclusion',
    title: 'Budgeting, Cash Flow Management & Micro-Credit Readiness',
    description: 'Coming soon.',
    status: 'coming_soon',
    order: 301,
    coverImageUrl: null,
    lessons: [],
  },
  {
    id: 'course-302',
    code: '302',
    track: 'track-3',
    trackTitle: 'Ag-Entrepreneurship & Financial Literacy',
    category: 'youth-entrepreneurship',
    title: 'Digital Marketing & Accessing Direct-to-Buyer Marketplaces',
    description: 'Coming soon.',
    status: 'coming_soon',
    order: 302,
    coverImageUrl: null,
    lessons: [],
  },
  {
    id: 'course-303',
    code: '303',
    track: 'track-3',
    trackTitle: 'Ag-Entrepreneurship & Financial Literacy',
    category: 'youth-entrepreneurship',
    title: 'Proposal Writing & Grant Pitching for Youth Startups',
    description: 'Coming soon.',
    status: 'coming_soon',
    order: 303,
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
