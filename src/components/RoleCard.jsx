export default function RoleCard({ icon, title, description, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`focus-ring flex w-full items-start gap-sm rounded-md border p-lg text-left transition-colors ${
        selected
          ? 'border-green-700 bg-green-100'
          : 'border-neutral-200 bg-neutral-50 hover:border-neutral-600 hover:bg-neutral-100'
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-body text-white ${
          selected ? 'bg-green-600' : 'bg-neutral-950'
        }`}
      >
        {icon}
      </span>
      <span className="flex-1">
        <span className="block text-h1 text-neutral-950">{title}</span>
        <span className="block text-caption text-neutral-600">{description}</span>
      </span>
      <span
        className={`mt-1 h-[18px] w-[18px] shrink-0 rounded-full border-2 ${
          selected ? 'border-green-700 bg-green-700' : 'border-neutral-200 bg-neutral-50'
        }`}
      />
    </button>
  )
}
