export function formatNaira(amount) {
  return `₦${amount.toLocaleString('en-NG')}`
}

export function formatDuration(totalSeconds) {
  const minutes = Math.round(totalSeconds / 60)
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (hours > 0) return `${hours}h ${remainingMinutes}m`
  return `${minutes}m`
}
