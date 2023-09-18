export function boolean(value: string | number | boolean) {
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
