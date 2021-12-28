export const integer = (value: string) => {
  return String(parseInt(value, 10)) === String(value)
}
