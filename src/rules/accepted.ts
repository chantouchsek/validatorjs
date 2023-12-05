export function accepted(value: boolean | number | string) {
  return value === 'on' || value === 'yes' || value === 1 || value === '1' || value === true
}
