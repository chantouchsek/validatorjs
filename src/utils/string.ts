export function formatter(attribute: string) {
  return attribute.replace(/[_.\[]/g, ' ').replace(/]/g, '')
}
export function toCamelCase(s: string) {
  return s.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '')
  })
}
export function onlyDigits(str: string | boolean | number) {
  const num = Number(str)
  return !Number.isNaN(num) && typeof str !== 'boolean'
}
