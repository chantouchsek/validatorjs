export function formatter(attribute: string) {
  return attribute.replace(/[_.[]/g, ' ').replaceAll(']', '')
}
export function toCamelCase(s: string) {
  return s.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '')
  })
}
export function toSnakeCase(e: string) {
  return (/[A-Z]/.test(e) ? e.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`) : e)
}
export function onlyDigits(str: boolean | number | string) {
  const num = Number(str)
  return !Number.isNaN(num) && typeof str !== 'boolean'
}
