import { isArray } from './array'

export function hasOwnProperty(
  object?: Record<string, any> | any,
  key?: string | number | symbol,
) {
  if (!object || !key) return false
  return Object.prototype.hasOwnProperty.call(object, key)
}
export const flattenObject = (obj: Record<string, any> | any = {}) => {
  const flattened: Record<string, any> = {}

  function recurse(current: Record<string, any>, property?: string) {
    if (!property && Object.getOwnPropertyNames(current).length === 0) {
      return
    }
    if (Object(current) !== current || isArray(current)) {
      flattened[property as string] = current
    } else {
      let isEmpty = true
      for (const p in current) {
        isEmpty = false
        recurse(current[p], property ? property + '.' + p : p)
      }
      if (isEmpty) {
        flattened[property as string] = {}
      }
    }
  }

  if (obj) {
    recurse(obj)
  }
  return flattened
}
export const objectPath = (obj: Record<string, any> | any, path: string) => {
  if (hasOwnProperty(obj, path)) {
    return obj[path]
  }

  const keys = path
    .replace(/\[(\w+)\]/g, '.$1')
    .replace(/^\./, '')
    .split('.')
  let copy: Record<string, any> = {}
  for (const attr in obj) {
    if (hasOwnProperty(obj, attr)) {
      copy[attr] = obj[attr]
    }
  }

  for (let i = 0, l = keys.length; i < l; i++) {
    if (
      typeof copy === 'object' &&
      copy !== null &&
      hasOwnProperty(copy, keys[i])
    ) {
      copy = copy[keys[i]]
    } else {
      return
    }
  }
  return copy
}
