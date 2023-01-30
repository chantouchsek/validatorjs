export const url = (value: string) => {
  try {
    return Boolean(new URL(value))
  } catch (e) {
    return false
  }
}
