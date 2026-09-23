export default function OptionCard({ title, description, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`focus-ring flex w-full items-center gap-sm rounded-md border p-sm text-left transition-colors ${
        selected
          ? 'border-green-700 bg-green-100'
          : 'border-neutral-200 bg-neutral-50 hover:border-neutral-600 hover:bg-neutral-100'
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          selected ? 'bg-green-700' : 'border-2 border-neutral-200 bg-neutral-50'
        }`}
      >
        {selected ? <span className="text-sm text-white">✓</span> : null}
      </span>
      <span className="flex-1">
        <span className="block text-h1 text-neutral-950">{title}</span>
        <span className="block text-caption text-neutral-600">{description}</span>
      </span>
    </button>
  )
}
