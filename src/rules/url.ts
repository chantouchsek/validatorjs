export function url(value: string) {
  try {
    return Boolean(new URL(value))
  }
  catch {
    return false
  }
}
