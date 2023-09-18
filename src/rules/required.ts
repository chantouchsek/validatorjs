export function required(value: any) {
  let str = ''
  if (value === undefined || value === null)
    return false

  str = String(value).replace(/\s/g, '')
  return str.length > 0
}
