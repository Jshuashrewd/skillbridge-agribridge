import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { AwardIcon, DownloadIcon, TrophyIcon } from '../components/icons'
import { useAuth } from '../context/AuthContext'
import { getCertificate } from '../lib/certificate'
import { getProgress } from '../lib/progress'

function formatIssuedDate(timestamp) {
  const date = timestamp?.toDate ? timestamp.toDate() : new Date()
  return date.toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function CertificatePage() {
  const { courseId } = useParams()
  const { user } = useAuth()

  const [certificate, setCertificate] = useState(undefined) // undefined = loading, null = not ready
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const certRef = useRef(null)

  useEffect(() => {
    if (!user) return undefined
    let cancelled = false
    getProgress(user.uid, courseId).then(async (progress) => {
      if (cancelled) return
      if (!progress?.certificateId) {
        setCertificate(null)
        return
      }
      const cert = await getCertificate(progress.certificateId)
      if (!cancelled) setCertificate(cert)
    })
    return () => {
      cancelled = true
    }
  }, [user, courseId])

  useEffect(() => {
    if (!certificate) return undefined
    let cancelled = false
    const verifyUrl = `${window.location.origin}/verify/${certificate.certId}`
    QRCode.toDataURL(verifyUrl, { margin: 1, width: 160, color: { dark: '#0f3d2e' } }).then(
      (dataUrl) => {
        if (!cancelled) setQrDataUrl(dataUrl)
      },
    )
    return () => {
      cancelled = true
    }
  }, [certificate])

  async function handleDownload(format) {
    if (!certRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(certRef.current, { backgroundColor: '#ffffff', scale: 2 })
      if (format === 'png') {
        const link = document.createElement('a')
        link.download = `${certificate.certId}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      } else {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height],
        })
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
        pdf.save(`${certificate.certId}.pdf`)
      }
    } finally {
      setDownloading(false)
    }
  }

  if (certificate === undefined) {
    return (
      <AppShell active="discover">
        <p className="px-md py-2xl text-center text-body text-neutral-600">
          Loading your certificate…
        </p>
      </AppShell>
    )
  }

  if (certificate === null) {
    return (
      <AppShell active="discover">
        <div className="mx-auto max-w-[600px] px-md py-2xl text-center">
          <h1 className="text-h2 text-neutral-950">No certificate yet</h1>
          <p className="mt-sm text-body text-neutral-600">
            Finish every lesson and knowledge check in this course to earn your certificate.
          </p>
          <Link
            to={`/course/${courseId}/learn`}
            className="focus-ring mt-lg inline-flex min-h-11 items-center rounded-md bg-green-600 px-lg text-body font-semibold text-white transition-colors hover:bg-green-700"
          >
            Continue learning
          </Link>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell active="discover">
      <div className="mx-auto w-full max-w-[768px] px-md py-lg lg:py-xl">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white">
            <TrophyIcon className="h-8 w-8" />
          </span>
          <h1 className="mt-md text-h2 text-neutral-950">Course complete!</h1>
          <p className="mt-2xs text-body text-neutral-600">
            You finished {certificate.courseTitle}. Your certificate is ready.
          </p>
        </div>

        <div
          ref={certRef}
          className="mt-lg rounded-lg border-2 border-green-700 bg-neutral-50 p-lg lg:p-xl"
        >
          <div className="flex items-center justify-between">
            <p className="text-h2 text-green-700">SkillBridge</p>
            <AwardIcon className="h-8 w-8 shrink-0 text-green-700" />
          </div>

          <p className="mt-lg text-center text-caption text-neutral-600">
            Certificate of Completion
          </p>
          <p className="mt-sm text-center text-body text-neutral-600">This certifies that</p>
          <p className="mt-2xs text-center text-h2 font-bold text-neutral-950">
            {certificate.userName}
          </p>
          <p className="mt-sm text-center text-body text-neutral-600">
            has successfully completed
          </p>
          <p className="mt-2xs text-center text-h1 text-neutral-950">{certificate.courseTitle}</p>

          <div className="mt-xl flex flex-col items-center gap-md sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-caption text-neutral-600">Date issued</p>
              <p className="text-body font-semibold text-neutral-950">
                {formatIssuedDate(certificate.issuedAt)}
              </p>
            </div>
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Scan to verify this certificate" className="h-20 w-20" />
            ) : (
              <div className="h-20 w-20 rounded-sm bg-neutral-200" aria-hidden="true" />
            )}
            <div className="text-center sm:text-right">
              <p className="text-caption text-neutral-600">Certificate ID</p>
              <p className="text-body font-semibold text-neutral-950">{certificate.certId}</p>
            </div>
          </div>
        </div>

        <div className="mt-lg flex flex-col gap-sm sm:flex-row">
          <button
            type="button"
            onClick={() => handleDownload('png')}
            disabled={downloading || !qrDataUrl}
            className="focus-ring flex min-h-11 flex-1 items-center justify-center gap-2xs rounded-md bg-green-600 text-body font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
          >
            <DownloadIcon className="h-5 w-5" />
            Download PNG
          </button>
          <button
            type="button"
            onClick={() => handleDownload('pdf')}
            disabled={downloading || !qrDataUrl}
            className="focus-ring flex min-h-11 flex-1 items-center justify-center gap-2xs rounded-md border border-green-600 text-body font-semibold text-green-700 transition-colors hover:bg-green-100 disabled:opacity-50"
          >
            <DownloadIcon className="h-5 w-5" />
            Download PDF
          </button>
        </div>

        <p className="mt-md text-center text-caption text-neutral-600">
          Anyone can verify this certificate at{' '}
          <Link
            to={`/verify/${certificate.certId}`}
            className="focus-ring rounded-sm font-semibold text-green-700 hover:underline"
          >
            /verify/{certificate.certId}
          </Link>
        </p>
      </div>
    </AppShell>
  )
}
