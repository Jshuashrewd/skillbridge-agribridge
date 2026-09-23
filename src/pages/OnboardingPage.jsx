import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OnboardingLayout from '../components/OnboardingLayout'
import OptionCard from '../components/onboarding/OptionCard'
import OptionChip from '../components/onboarding/OptionChip'
import { CheckCircleIcon } from '../components/icons'

const GOAL_OPTIONS = [
  { key: 'role', title: 'Grow in my current role', description: 'Build skills that help you do better work now.' },
  { key: 'career', title: 'Change careers', description: 'Prepare for a new role with guided learning paths.' },
  {
    key: 'business',
    title: 'Start or grow a business',
    description: 'Learn practical business, marketing and operations skills.',
  },
  {
    key: 'skill',
    title: 'Build a personal skill',
    description: 'Learn something useful simply because you want to.',
  },
]

const INTEREST_OPTIONS = [
  'UI/UX Design',
  'Graphic Design',
  'Product Management',
  'Web Development',
  'Data Analysis',
  'Digital Marketing',
  'Business',
  'AI & Automation',
  'Career Development',
]

const LEVEL_OPTIONS = [
  { key: 'beginner', title: 'Beginner', description: 'I am new to most of the skills I want to learn.' },
  {
    key: 'intermediate',
    title: 'Intermediate',
    description: 'I know the basics and want to become more confident.',
  },
  {
    key: 'advanced',
    title: 'Advanced',
    description: 'I already have strong foundations and want deeper material.',
  },
]

const PREFERENCE_OPTIONS = [
  'Short video lessons',
  'Reading & guides',
  'Hands-on projects',
  'Quizzes & practice',
  'Live sessions',
  'Downloadable resources',
]

const WEEKLY_HOURS_OPTIONS = ['1–2 hours', '3–5 hours', '6–8 hours', '9+ hours']
const LESSON_LENGTH_OPTIONS = ['Under 15 min', '15–30 min', '30–60 min']

const BackButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="focus-ring min-h-11 rounded-md border border-neutral-200 bg-neutral-50 px-lg py-sm text-body text-green-700 transition-colors hover:bg-neutral-100"
  >
    Back
  </button>
)

const ContinueButton = ({ onClick, disabled, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="focus-ring min-h-11 rounded-md bg-green-700 px-lg py-sm text-body text-white transition-colors hover:bg-green-900 disabled:opacity-50"
  >
    {children}
  </button>
)

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [goal, setGoal] = useState('')
  const [interests, setInterests] = useState([])
  const [level, setLevel] = useState('')
  const [preferences, setPreferences] = useState([])
  const [weeklyHours, setWeeklyHours] = useState('')
  const [lessonLength, setLessonLength] = useState('')

  function toggle(list, setList, value) {
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value])
  }

  function goBack() {
    if (step === 1) {
      navigate(-1)
    } else {
      setStep((current) => current - 1)
    }
  }

  function goToDashboard() {
    navigate('/discover', { replace: true })
  }

  if (step === 1) {
    return (
      <OnboardingLayout
        step={1}
        leftHeadline="Start with your goal"
        leftSubtext="Tell us what you want learning to change for you."
        bullets={['Better recommendations', 'More relevant course difficulty', 'A learning path that fits your goal']}
        title="What are you learning for?"
        subtitle="Your answer helps SkillBridge recommend the right level, course length and learning path."
        onBack={goBack}
      >
        <div className="flex flex-col gap-sm">
          {GOAL_OPTIONS.map((option) => (
            <OptionCard
              key={option.key}
              title={option.title}
              description={option.description}
              selected={goal === option.key}
              onSelect={() => setGoal(option.key)}
            />
          ))}
        </div>
        <div className="mt-2xl flex items-center justify-between">
          <BackButton onClick={goBack} />
          <ContinueButton onClick={() => setStep(2)} disabled={!goal}>
            Continue
          </ContinueButton>
        </div>
      </OnboardingLayout>
    )
  }

  if (step === 2) {
    return (
      <OnboardingLayout
        step={2}
        leftHeadline="Shape your recommendations"
        leftSubtext="Pick the topics that should appear more often in your SkillBridge experience."
        bullets={['Choose more than one', 'Update interests anytime', 'Used for course recommendations']}
        title="What do you want to learn?"
        subtitle="Choose a few topics now. You can always update them later."
        onBack={goBack}
      >
        <div className="grid grid-cols-2 gap-sm sm:grid-cols-3">
          {INTEREST_OPTIONS.map((option) => (
            <OptionChip
              key={option}
              label={option}
              selected={interests.includes(option)}
              onSelect={() => toggle(interests, setInterests, option)}
            />
          ))}
        </div>
        <div className="mt-2xl flex items-center justify-between">
          <BackButton onClick={goBack} />
          <ContinueButton onClick={() => setStep(3)} disabled={interests.length === 0}>
            Continue
          </ContinueButton>
        </div>
      </OnboardingLayout>
    )
  }

  if (step === 3) {
    return (
      <OnboardingLayout
        step={3}
        leftHeadline="Meet you where you are"
        leftSubtext="Your starting level changes the depth and pace of the courses we recommend."
        bullets={['Beginner-friendly when needed', 'Skip material you already know', 'Adjust later from your profile']}
        title="What level feels right?"
        subtitle="This helps us avoid recommending courses that are too basic or too advanced."
        onBack={goBack}
      >
        <div className="flex flex-col gap-sm">
          {LEVEL_OPTIONS.map((option) => (
            <OptionCard
              key={option.key}
              title={option.title}
              description={option.description}
              selected={level === option.key}
              onSelect={() => setLevel(option.key)}
            />
          ))}
        </div>
        <div className="mt-2xl flex items-center justify-between">
          <BackButton onClick={goBack} />
          <ContinueButton onClick={() => setStep(4)} disabled={!level}>
            Continue
          </ContinueButton>
        </div>
      </OnboardingLayout>
    )
  }

  if (step === 4) {
    return (
      <OnboardingLayout
        step={4}
        leftHeadline="Make learning feel natural"
        leftSubtext="SkillBridge can prioritize course formats that match how you prefer to learn."
        bullets={['Video, reading or projects', 'Mix multiple learning formats', 'Change preferences anytime']}
        title="How do you learn best?"
        subtitle="Choose the formats that make it easiest for you to stay engaged."
        onBack={goBack}
      >
        <p className="mb-sm text-h1 text-neutral-950">How do you prefer to learn?</p>
        <div className="grid grid-cols-2 gap-sm">
          {PREFERENCE_OPTIONS.map((option) => (
            <OptionChip
              key={option}
              label={option}
              selected={preferences.includes(option)}
              onSelect={() => toggle(preferences, setPreferences, option)}
            />
          ))}
        </div>
        <div className="mt-2xl flex items-center justify-between">
          <BackButton onClick={goBack} />
          <ContinueButton onClick={() => setStep(5)} disabled={preferences.length === 0}>
            Continue
          </ContinueButton>
        </div>
      </OnboardingLayout>
    )
  }

  if (step === 5) {
    return (
      <OnboardingLayout
        step={5}
        leftHeadline="Consistency beats intensity"
        leftSubtext="A small repeatable weekly goal makes progress easier to maintain."
        bullets={[
          'A realistic weekly target',
          'Lesson lengths that fit your schedule',
          'Progress reminders without pressure',
        ]}
        title="Build a learning rhythm you can keep."
        subtitle="Set a realistic weekly target so SkillBridge can help you stay consistent."
        onBack={goBack}
      >
        <p className="mb-sm text-h1 text-neutral-950">How much time can you learn each week?</p>
        <div className="grid grid-cols-2 gap-sm">
          {WEEKLY_HOURS_OPTIONS.map((option) => (
            <OptionChip
              key={option}
              label={option}
              selected={weeklyHours === option}
              onSelect={() => setWeeklyHours(option)}
            />
          ))}
        </div>
        <p className="mt-lg mb-sm text-h1 text-neutral-950">Preferred lesson length</p>
        <div className="grid grid-cols-3 gap-sm">
          {LESSON_LENGTH_OPTIONS.map((option) => (
            <OptionChip
              key={option}
              label={option}
              selected={lessonLength === option}
              onSelect={() => setLessonLength(option)}
            />
          ))}
        </div>
        <div className="mt-2xl flex items-center justify-between">
          <BackButton onClick={goBack} />
          <ContinueButton onClick={() => setStep(6)} disabled={!weeklyHours || !lessonLength}>
            Continue
          </ContinueButton>
        </div>
      </OnboardingLayout>
    )
  }

  if (step === 6) {
    const topInterests = interests.slice(0, 3)
    const focusLine =
      topInterests.length > 0
        ? `Focused on ${topInterests.length === 1 ? topInterests[0] : `${topInterests.slice(0, -1).join(', ')} and ${topInterests[topInterests.length - 1]}`}.`
        : 'Focused on the topics you chose.'
    const levelLabel = LEVEL_OPTIONS.find((option) => option.key === level)?.title ?? 'Intermediate'
    const formatLine =
      preferences.length > 0 ? `${preferences.slice(0, 2).join(' and ')} prioritized.` : 'A mix of formats prioritized.'

    return (
      <OnboardingLayout
        step={6}
        leftHeadline="Your plan, not a template"
        leftSubtext="This starting plan is personalized from everything you selected during onboarding."
        bullets={['Recommendations tuned to you', 'Weekly progress built around your time', 'Easy to change later']}
        title="Here's a plan built around you."
        subtitle="We combined your goal, interests, level and schedule into a practical starting point."
        onBack={goBack}
      >
        <div className="rounded-[14px] border border-green-700 bg-green-100 p-md">
          <p className="text-[10px] font-semibold uppercase leading-[14px] tracking-[1.2px] text-green-700">
            Your starting plan
          </p>
          <p className="mt-sm text-h2 text-neutral-950">{weeklyHours || '3–5 hours'} each week</p>
          <p className="mt-2xs text-sm text-neutral-600">{focusLine}</p>
          <div className="mt-md flex flex-col gap-sm">
            <span className="text-sm text-neutral-950">
              <span className="text-green-700">✓</span> {levelLabel} difficulty
            </span>
            <span className="text-sm text-neutral-950">
              <span className="text-green-700">✓</span> Short lessons {lessonLength || 'under 15 minutes'}
            </span>
            <span className="text-sm text-neutral-950">
              <span className="text-green-700">✓</span> {formatLine}
            </span>
          </div>
        </div>
        <p className="mt-md text-caption text-neutral-600">
          You can update any of these preferences later from your profile.
        </p>
        <div className="mt-2xl flex items-center justify-between">
          <BackButton onClick={goBack} />
          <ContinueButton onClick={() => setStep(7)}>Use this plan</ContinueButton>
        </div>
      </OnboardingLayout>
    )
  }

  return (
    <OnboardingLayout
      step={7}
      leftHeadline="Ready when you are"
      leftSubtext="Your dashboard is now personalized around the way you want to learn."
      bullets={[
        'Personalized course recommendations',
        'A weekly learning rhythm',
        'Progress that adapts with you',
      ]}
      title="Your SkillBridge experience is ready."
      subtitle="Everything is set up. You can change your preferences whenever you need to."
    >
      <CheckCircleIcon className="h-16 w-16 text-green-700" />
      <p className="mt-lg text-h2 text-neutral-950">You're ready to start learning.</p>
      <p className="mt-2xs text-sm text-neutral-600">
        Your dashboard will now prioritize courses and learning paths based on the plan you just created.
      </p>
      <div className="mt-lg rounded-md border border-neutral-200 bg-neutral-50 p-md">
        <p className="text-[10px] font-semibold uppercase leading-[14px] tracking-[1.2px] text-green-700">Next up</p>
        <p className="mt-sm text-body text-neutral-950">
          Explore your recommended courses and start your first lesson.
        </p>
      </div>
      <button
        type="button"
        onClick={goToDashboard}
        className="focus-ring mt-2xl min-h-11 w-full rounded-md bg-green-700 py-sm text-body text-white transition-colors hover:bg-green-900"
      >
        Go to dashboard
      </button>
    </OnboardingLayout>
  )
}
