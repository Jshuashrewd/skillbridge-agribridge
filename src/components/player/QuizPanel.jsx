import { useEffect, useState } from 'react'
import { CheckCircleIcon, XCircleIcon } from '../icons'

// Self-contained knowledge-check flow: one question at a time, wrong
// answers can be retried immediately, and a question only advances once
// answered correctly. `onPass` fires once every question has been
// answered correctly. `onProgress` reports {passed, total} so the parent
// can render the "Quiz progress" sidebar to match the design.
export default function QuizPanel({ questions, onPass, onProgress }) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [passedIds, setPassedIds] = useState(() => new Set())
  const [feedback, setFeedback] = useState(null) // null | 'correct' | 'incorrect'

  useEffect(() => {
    onProgress?.({ passed: passedIds.size, total: questions.length })
  }, [passedIds, questions.length, onProgress])

  const question = questions[index]
  const selected = answers[question.id] ?? null
  const isLast = index === questions.length - 1
  const currentPassed = passedIds.has(question.id)

  function selectChoice(choiceIndex) {
    if (currentPassed) return
    setAnswers((prev) => ({ ...prev, [question.id]: choiceIndex }))
    setFeedback(null)
  }

  function checkAnswer() {
    if (selected === null) return
    const correct = selected === question.correctIndex
    setFeedback(correct ? 'correct' : 'incorrect')
    if (correct) {
      setPassedIds((prev) => new Set(prev).add(question.id))
    }
  }

  function goPrevious() {
    setIndex((i) => Math.max(0, i - 1))
    setFeedback(null)
  }

  function goNext() {
    if (isLast) {
      onPass()
      return
    }
    setIndex((i) => Math.min(questions.length - 1, i + 1))
    setFeedback(null)
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-md lg:p-lg">
      <h1 className="text-h2 text-neutral-950">Knowledge check</h1>
      <p className="mt-2xs text-body text-neutral-600">
        Test your understanding before moving to the next lesson.
      </p>

      <div className="mt-lg rounded-lg border border-neutral-200 bg-neutral-50 p-md">
        <p className="text-caption font-semibold text-green-700">
          Question {index + 1} of {questions.length}
        </p>
        <h2 className="mt-2xs text-h1 text-neutral-950">{question.prompt}</h2>

        <div className="mt-md flex flex-col gap-xs">
          {question.choices.map((choice, choiceIndex) => {
            const isSelected = selected === choiceIndex
            const showCorrect = feedback && isSelected && choiceIndex === question.correctIndex
            const showIncorrect = feedback === 'incorrect' && isSelected

            return (
              <button
                key={choice}
                type="button"
                onClick={() => selectChoice(choiceIndex)}
                disabled={currentPassed}
                className={`focus-ring flex min-h-11 items-center gap-sm rounded-lg border p-sm text-left text-body transition-colors disabled:cursor-default ${
                  showCorrect
                    ? 'border-green-600 bg-green-100 text-green-900'
                    : showIncorrect
                      ? 'border-red-700 bg-red-100 text-red-700'
                      : isSelected
                        ? 'border-green-600 bg-green-100 text-neutral-950'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-950 hover:border-neutral-600'
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    showIncorrect
                      ? 'border-red-700'
                      : isSelected
                        ? 'border-green-600'
                        : 'border-neutral-200'
                  }`}
                >
                  {isSelected ? (
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${showIncorrect ? 'bg-red-700' : 'bg-green-600'}`}
                    />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-semibold">{String.fromCharCode(65 + choiceIndex)}.</span>{' '}
                  {choice}
                </span>
              </button>
            )
          })}
        </div>

        {feedback === 'incorrect' ? (
          <p className="mt-sm flex items-center gap-2xs text-caption font-semibold text-red-700">
            <XCircleIcon className="h-4 w-4 shrink-0" />
            Not quite — pick another answer and try again.
          </p>
        ) : null}
        {feedback === 'correct' ? (
          <p className="mt-sm flex items-center gap-2xs text-caption font-semibold text-green-700">
            <CheckCircleIcon className="h-4 w-4 shrink-0" />
            Correct!
          </p>
        ) : null}

        <div className="mt-lg flex items-center justify-between gap-sm">
          <button
            type="button"
            onClick={goPrevious}
            disabled={index === 0}
            className="focus-ring min-h-11 rounded-md border border-green-600 px-lg text-body font-semibold text-green-700 transition-colors hover:bg-green-100 disabled:cursor-default disabled:opacity-40"
          >
            Previous
          </button>
          {currentPassed ? (
            <button
              type="button"
              onClick={goNext}
              className="focus-ring min-h-11 rounded-md bg-green-600 px-lg text-body font-semibold text-white transition-colors hover:bg-green-700"
            >
              {isLast ? 'Finish' : 'Next question'}
            </button>
          ) : (
            <button
              type="button"
              onClick={checkAnswer}
              disabled={selected === null}
              className="focus-ring min-h-11 rounded-md bg-green-600 px-lg text-body font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
            >
              Check answer
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
