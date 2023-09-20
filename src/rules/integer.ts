export function integer(value: string) {
  return !Array.isArray(value) && String(Number.parseInt(value, 10)) === String(value)
}
