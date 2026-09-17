import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import OrderSummaryCard from '../components/checkout/OrderSummaryCard'
import PaymentMethodOption from '../components/checkout/PaymentMethodOption'
import { BankIcon, CheckCircleIcon, ChevronLeftIcon, CreditCardIcon, PhoneIcon } from '../components/icons'
import Stepper from '../components/Stepper'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { db } from '../lib/firebase'
import { formatNaira } from '../lib/format'

const CHECKOUT_STEPS = [
  { key: 'checkout', label: 'Checkout' },
  { key: 'payment', label: 'Payment' },
  { key: 'review', label: 'Review' },
]

const PAYMENT_METHODS = [
  { key: 'card', label: 'Card', description: 'Visa, Mastercard, Verve', icon: CreditCardIcon },
  { key: 'bank_transfer', label: 'Bank Transfer', description: 'Transfer from your bank', icon: BankIcon },
  { key: 'ussd', label: 'USSD', description: 'Pay with *737#', icon: PhoneIcon },
]

const inputClass =
  'rounded-md border border-neutral-200 bg-neutral-50 px-sm py-sm text-body text-neutral-950 outline-none transition-colors hover:border-neutral-600 focus:border-green-600 focus:ring-2 focus:ring-green-600/20'

export default function CheckoutPage() {
  const { courseId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const showToast = useToast()

  const [course, setCourse] = useState(undefined)
  const [step, setStep] = useState('checkout')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardNumber, setCardNumber] = useState('')
  const [nameOnCard, setNameOnCard] = useState(user?.displayName ?? '')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let cancelled = false
    getDoc(doc(db, 'courses', courseId)).then((snap) => {
      if (!cancelled) setCourse(snap.exists() ? { id: snap.id, ...snap.data() } : null)
    })
    return () => {
      cancelled = true
    }
  }, [courseId])

  const paymentValid =
    paymentMethod !== 'card' || (cardNumber.trim() && nameOnCard.trim() && expiry.trim() && cvv.trim())
  const selectedMethod = PAYMENT_METHODS.find((method) => method.key === paymentMethod)

  async function handleConfirmAndPay() {
    setProcessing(true)
    // No real payment gateway — this always succeeds.
    await new Promise((resolve) => setTimeout(resolve, 900))
    await setDoc(doc(db, 'users', user.uid, 'enrollments', courseId), {
      courseId,
      courseTitle: course.title,
      price: course.price,
      paymentMethod,
      status: 'active',
      enrolledAt: serverTimestamp(),
    })
    setProcessing(false)
    setSuccess(true)
  }

  function handleGoToMyLearning() {
    showToast('My Learning is coming soon.')
    navigate('/discover')
  }

  if (course === undefined) {
    return (
      <AppShell active="discover">
        <p className="px-md py-2xl text-center text-body text-neutral-600">Loading…</p>
      </AppShell>
    )
  }

  if (course === null || course.status !== 'published') {
    return (
      <AppShell active="discover">
        <div className="mx-auto max-w-[600px] px-md py-2xl text-center">
          <h1 className="text-h2 text-neutral-950">This course isn't available</h1>
          <Link
            to="/discover"
            className="focus-ring mt-lg inline-flex min-h-11 items-center rounded-md bg-green-600 px-lg text-body font-semibold text-white transition-colors hover:bg-green-700"
          >
            Back to Discover
          </Link>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell active="discover">
      <div className="mx-auto w-full max-w-5xl px-md py-md lg:px-xl lg:py-lg">
        <Link
          to={`/course/${courseId}`}
          className="focus-ring inline-flex min-h-11 items-center gap-2xs rounded-sm text-caption font-semibold text-neutral-600 hover:text-neutral-950"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Back to course
        </Link>

        <div className="mt-sm">
          <Stepper steps={CHECKOUT_STEPS} current={step} />
        </div>

        <div className="mt-lg lg:flex lg:items-start lg:gap-xl">
          <div className="min-w-0 flex-1">
            {step === 'checkout' ? (
              <>
                <h1 className="text-h2 text-neutral-950">Checkout</h1>
                <p className="mt-2xs text-body text-neutral-600">Complete your purchase to start learning.</p>

                <div className="mt-lg flex items-center gap-sm rounded-lg border border-neutral-200 bg-neutral-50 p-sm">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-green-100 text-caption font-semibold text-green-700">
                    {course.code}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body font-semibold text-neutral-950">{course.title}</p>
                    <p className="truncate text-caption text-neutral-600">{course.instructorName}</p>
                  </div>
                  <p className="shrink-0 text-body font-semibold text-neutral-950">
                    {formatNaira(course.price)}
                  </p>
                </div>

                <h2 className="mt-lg text-h1 text-neutral-950">Payment method</h2>
                <div className="mt-sm flex flex-col gap-sm">
                  {PAYMENT_METHODS.map((method) => (
                    <PaymentMethodOption
                      key={method.key}
                      icon={method.icon}
                      label={method.label}
                      description={method.description}
                      selected={paymentMethod === method.key}
                      onSelect={() => setPaymentMethod(method.key)}
                    />
                  ))}
                </div>

                <div className="mt-lg lg:hidden">
                  <OrderSummaryCard course={course} />
                </div>

                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="focus-ring mt-lg min-h-11 w-full rounded-md bg-green-600 text-body font-semibold text-white transition-colors hover:bg-green-700"
                >
                  Continue to payment
                </button>
              </>
            ) : null}

            {step === 'payment' ? (
              <>
                <h1 className="text-h2 text-neutral-950">Payment details</h1>

                {paymentMethod === 'card' ? (
                  <>
                    <p className="mt-2xs text-body text-neutral-600">
                      Enter your card details to complete your purchase.
                    </p>
                    <div className="mt-lg rounded-lg border border-neutral-200 bg-neutral-50 p-md">
                      <h2 className="text-h1 text-neutral-950">Credit or debit card</h2>
                      <p className="mt-2xs text-caption text-neutral-600">Visa · Mastercard · Verve</p>
                      <div className="mt-md flex flex-col gap-md">
                        <label className="flex flex-col gap-2xs">
                          <span className="text-caption text-neutral-600">Card number</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(event) => setCardNumber(event.target.value)}
                            className={inputClass}
                          />
                        </label>
                        <label className="flex flex-col gap-2xs">
                          <span className="text-caption text-neutral-600">Name on card</span>
                          <input
                            type="text"
                            placeholder="Full name"
                            value={nameOnCard}
                            onChange={(event) => setNameOnCard(event.target.value)}
                            className={inputClass}
                          />
                        </label>
                        <div className="flex gap-sm">
                          <label className="flex flex-1 flex-col gap-2xs">
                            <span className="text-caption text-neutral-600">Expiry date</span>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              value={expiry}
                              onChange={(event) => setExpiry(event.target.value)}
                              className={inputClass}
                            />
                          </label>
                          <label className="flex flex-1 flex-col gap-2xs">
                            <span className="text-caption text-neutral-600">CVV</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="123"
                              value={cvv}
                              onChange={(event) => setCvv(event.target.value)}
                              className={inputClass}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}

                {paymentMethod === 'bank_transfer' ? (
                  <>
                    <p className="mt-2xs text-body text-neutral-600">
                      Transfer to the account below to complete your purchase.
                    </p>
                    <div className="mt-lg flex flex-col gap-sm rounded-lg border border-neutral-200 bg-neutral-50 p-md">
                      <TransferRow label="Bank name" value="SkillBridge Demo Bank" />
                      <TransferRow label="Account number" value="0123456789" />
                      <TransferRow label="Account name" value="SkillBridge Learning Ltd" />
                      <TransferRow label="Amount" value={formatNaira(course.price)} />
                    </div>
                  </>
                ) : null}

                {paymentMethod === 'ussd' ? (
                  <>
                    <p className="mt-2xs text-body text-neutral-600">
                      Dial the code below on your bank-linked phone number to complete payment.
                    </p>
                    <div className="mt-lg flex flex-col gap-sm rounded-lg border border-neutral-200 bg-neutral-50 p-md">
                      <TransferRow label="Dial code" value={`*737*000*${course.price}#`} />
                      <TransferRow label="Amount" value={formatNaira(course.price)} />
                    </div>
                  </>
                ) : null}

                <div className="mt-lg lg:hidden">
                  <OrderSummaryCard course={course} />
                </div>

                <div className="mt-lg flex flex-col gap-sm">
                  <button
                    type="button"
                    onClick={() => setStep('review')}
                    disabled={!paymentValid}
                    className="focus-ring min-h-11 w-full rounded-md bg-green-600 text-body font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                  >
                    Continue to review
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('checkout')}
                    className="focus-ring flex min-h-11 w-full items-center justify-center rounded-md text-body font-semibold text-green-700 transition-colors hover:bg-green-100"
                  >
                    Back
                  </button>
                </div>
              </>
            ) : null}

            {step === 'review' ? (
              <>
                <h1 className="text-h2 text-neutral-950">Review your order</h1>
                <p className="mt-2xs text-body text-neutral-600">Confirm your details before completing your purchase.</p>

                <div className="mt-lg flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 p-sm">
                  <div className="flex items-center gap-sm">
                    <selectedMethod.icon className="h-6 w-6 shrink-0 text-neutral-600" />
                    <span className="text-body font-semibold text-neutral-950">{selectedMethod.label}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('checkout')}
                    className="focus-ring rounded-sm text-caption font-semibold text-green-700 hover:underline"
                  >
                    Change
                  </button>
                </div>

                <h2 className="mt-lg text-h1 text-neutral-950">Billing details</h2>
                <div className="mt-sm rounded-lg border border-neutral-200 bg-neutral-50 p-sm text-body text-neutral-950">
                  <p>{user?.displayName ?? 'Learner'}</p>
                  <p className="text-neutral-600">{user?.email}</p>
                </div>

                <div className="mt-lg lg:hidden">
                  <OrderSummaryCard course={course} />
                </div>

                <label className="mt-lg flex items-start gap-2xs text-caption text-neutral-600">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(event) => setAgreed(event.target.checked)}
                    className="mt-2xs h-4 w-4 shrink-0 rounded-sm border-neutral-200 text-green-600 focus:ring-green-600/20"
                  />
                  I agree to the Terms of Service and Refund Policy
                </label>

                <button
                  type="button"
                  onClick={handleConfirmAndPay}
                  disabled={!agreed || processing}
                  className="focus-ring mt-lg min-h-11 w-full rounded-md bg-green-600 text-body font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                >
                  {processing ? 'Processing…' : `Confirm and pay ${formatNaira(course.price)}`}
                </button>
              </>
            ) : null}
          </div>

          <div className="mt-lg hidden lg:mt-0 lg:block lg:w-80 lg:shrink-0">
            <div className="sticky top-24 flex flex-col gap-md">
              <OrderSummaryCard course={course} />
              <p className="rounded-md bg-green-100 px-sm py-sm text-caption text-green-700">
                <span className="font-semibold">Secure payment.</span> Your payment information is
                encrypted and protected.
              </p>
            </div>
          </div>
        </div>
      </div>

      {success ? (
        <SuccessModal
          course={course}
          onStartLearning={() => navigate(`/course/${courseId}/learn`)}
          onGoToMyLearning={handleGoToMyLearning}
        />
      ) : null}
    </AppShell>
  )
}

function TransferRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-sm">
      <span className="text-caption text-neutral-600">{label}</span>
      <span className="text-body font-semibold text-neutral-950">{value}</span>
    </div>
  )
}

function SuccessModal({ course, onStartLearning, onGoToMyLearning }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/50 px-md">
      <div className="w-full max-w-[400px] rounded-lg bg-neutral-50 p-lg text-center shadow-lg">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white">
          <CheckCircleIcon className="h-8 w-8" />
        </span>
        <h1 className="mt-md text-h2 text-neutral-950">Payment successful!</h1>
        <p className="mt-2xs text-body text-neutral-600">You're enrolled in {course.title}.</p>

        <div className="mt-lg flex flex-col gap-sm">
          <button
            type="button"
            onClick={onStartLearning}
            className="focus-ring min-h-11 w-full rounded-md bg-green-600 text-body font-semibold text-white transition-colors hover:bg-green-700"
          >
            Start learning
          </button>
          <button
            type="button"
            onClick={onGoToMyLearning}
            className="focus-ring min-h-11 w-full rounded-md border border-green-600 text-body font-semibold text-green-700 transition-colors hover:bg-green-100"
          >
            Go to my learning
          </button>
        </div>
      </div>
    </div>
  )
}
