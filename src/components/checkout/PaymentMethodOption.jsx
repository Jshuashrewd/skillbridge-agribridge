export default function PaymentMethodOption({ icon: Icon, label, description, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`focus-ring flex w-full items-center gap-sm rounded-lg border p-sm text-left transition-colors ${
        selected
          ? 'border-green-600 bg-green-100'
          : 'border-neutral-200 bg-neutral-50 hover:border-neutral-600 hover:bg-neutral-100'
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? 'border-green-600' : 'border-neutral-200'
        }`}
      >
        {selected ? <span className="h-2 w-2 rounded-full bg-green-600" /> : null}
      </span>
      <Icon className="h-6 w-6 shrink-0 text-neutral-600" />
      <span className="flex-1">
        <span className="block text-body font-semibold text-neutral-950">{label}</span>
        <span className="block text-caption text-neutral-600">{description}</span>
      </span>
    </button>
  )
}
