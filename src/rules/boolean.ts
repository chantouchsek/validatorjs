export function boolean(value: boolean | number | string) {
  return (
    value === true
    || value === false
    || value === 0
    || value === 1
    || value === '0'
    || value === '1'
    || value === 'true'
    || value === 'false'
  )
}
