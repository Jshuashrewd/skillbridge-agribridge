import { useToast } from '../../context/ToastContext'
import { TOOLKITS } from '../../data/toolkits'
import { DownloadIcon, FileTextIcon } from '../icons'

export default function ToolkitsSection() {
  const showToast = useToast()

  return (
    <section className="mt-lg">
      <h2 className="text-h1 text-neutral-950">Toolkits</h2>
      <p className="mt-2xs text-body text-neutral-600">
        Practical, printable resources that go with the curriculum.
      </p>
      <div className="mt-sm grid gap-sm sm:grid-cols-2">
        {TOOLKITS.map((toolkit) => (
          <div
            key={toolkit.id}
            className="flex items-start gap-sm rounded-lg border border-neutral-200 bg-neutral-50 p-sm"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-green-100 text-green-700">
              <FileTextIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-body font-semibold text-neutral-950">{toolkit.title}</p>
              <p className="mt-2xs text-caption text-neutral-600">{toolkit.description}</p>
              <div className="mt-xs">
                {toolkit.comingSoon ? (
                  <span className="inline-block rounded-full bg-amber-100 px-xs py-2xs text-caption font-semibold text-amber-700">
                    Coming Soon
                  </span>
                ) : (
                  <a
                    href={toolkit.fileUrl}
                    download
                    onClick={() => showToast(`Downloading ${toolkit.title}…`)}
                    className="focus-ring inline-flex min-h-8 items-center gap-2xs rounded-sm text-caption font-semibold text-green-700 hover:underline"
                  >
                    <DownloadIcon className="h-4 w-4" />
                    Download PDF
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
