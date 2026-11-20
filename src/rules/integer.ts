export function integer(value: string) {
  if (Array.isArray(value)) return false
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && String(parsed) === String(value)
}
