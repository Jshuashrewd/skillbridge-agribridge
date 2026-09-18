import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircleIcon, XCircleIcon } from '../components/icons'
import { getCertificate } from '../lib/certificate'

function formatIssuedDate(timestamp) {
  const date = timestamp?.toDate ? timestamp.toDate() : null
  if (!date) return '—'
  return date.toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function VerifyCertificatePage() {
  const { certId } = useParams()
  const [certificate, setCertificate] = useState(undefined) // undefined = loading, null = not found

  useEffect(() => {
    let cancelled = false
    getCertificate(certId).then((cert) => {
      if (!cancelled) setCertificate(cert)
    })
    return () => {
      cancelled = true
    }
  }, [certId])

  return (
    <div className="flex min-h-svh items-center justify-center bg-neutral-100 px-md py-2xl">
      <div className="w-full max-w-[440px] rounded-lg border border-neutral-200 bg-neutral-50 p-lg text-center">
        <p className="text-h2 text-green-700">SkillBridge</p>

        {certificate === undefined ? (
          <p className="mt-lg text-body text-neutral-600">Checking certificate…</p>
        ) : certificate === null ? (
          <>
            <span className="mx-auto mt-lg flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-700">
              <XCircleIcon className="h-8 w-8" />
            </span>
            <h1 className="mt-md text-h2 text-neutral-950">Certificate not found</h1>
            <p className="mt-2xs text-body text-neutral-600">
              We couldn't find a certificate with ID <span className="font-semibold">{certId}</span>.
            </p>
          </>
        ) : (
          <>
            <span className="mx-auto mt-lg flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white">
              <CheckCircleIcon className="h-8 w-8" />
            </span>
            <h1 className="mt-md text-h2 text-neutral-950">Certificate found</h1>
            <div className="mt-lg flex flex-col gap-sm text-left">
              <div>
                <p className="text-caption text-neutral-600">Awarded to</p>
                <p className="text-body font-semibold text-neutral-950">{certificate.userName}</p>
              </div>
              <div>
                <p className="text-caption text-neutral-600">Course</p>
                <p className="text-body font-semibold text-neutral-950">
                  {certificate.courseTitle}
                </p>
              </div>
              <div>
                <p className="text-caption text-neutral-600">Date issued</p>
                <p className="text-body font-semibold text-neutral-950">
                  {formatIssuedDate(certificate.issuedAt)}
                </p>
              </div>
              <div>
                <p className="text-caption text-neutral-600">Certificate ID</p>
                <p className="text-body font-semibold text-neutral-950">{certificate.certId}</p>
              </div>
            </div>
          </>
        )}

        <Link
          to="/discover"
          className="focus-ring mt-lg inline-flex min-h-11 items-center rounded-md text-body font-semibold text-green-700 hover:underline"
        >
          Go to SkillBridge
        </Link>
      </div>
    </div>
  )
}
