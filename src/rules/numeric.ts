export const numeric = (value: string | number | boolean) => {
  const num = Number(value)
  return !isNaN(num) && typeof value !== 'boolean'
}
