export const formatter = (attribute: string) => {
  return attribute.replace(/[_\[]/g, ' ').replace(/]/g, '')
}
export function toCamelCase(s: string) {
  return s.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '')
  })
}
export function toSnakeCase(str: string) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}
