export default function OptionChip({ label, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`focus-ring flex min-h-[52px] w-full items-center rounded-[10px] border px-sm py-xs text-left text-sm transition-colors ${
        selected
          ? 'border-green-700 bg-green-100 text-green-700'
          : 'border-neutral-200 bg-neutral-50 text-neutral-950 hover:border-neutral-600 hover:bg-neutral-100'
      }`}
    >
      {selected ? '✓ ' : ''}
      {label}
    </button>
  )
}
