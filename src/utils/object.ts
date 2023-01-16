import { isArray } from 'lodash'

export function hasOwnProperty(object?: Record<string, any> | any, key?: string | number | symbol) {
  if (!object || !key) return false
  return Object.prototype.hasOwnProperty.call(object, key)
}
export const flattenObject = (obj: Record<string, any> | any = {}) => {
  const flattened: Record<string, any> = {}

  function recurse(current: Record<string, any>, property?: string) {
    if (!property && Object.getOwnPropertyNames(current).length === 0) return
    if (Object(current) !== current || isArray(current)) {
      flattened[property as string] = current
    } else {
      let isEmpty = true
      for (const p in current) {
        isEmpty = false
        recurse(current[p], property ? property + '.' + p : p)
      }
      if (isEmpty) flattened[property as string] = {}
    }
  }

  if (obj) {
    recurse(obj)
  }
  return flattened
}
export function isEmpty(obj: any) {
  if (typeof obj === 'number') return false
  else if (typeof obj === 'string') return obj.length === 0
  else if (isArray(obj)) return obj.length === 0
  else if (typeof obj === 'object') return obj === null || Object.keys(obj).length === 0
  else if (typeof obj === 'boolean') return false
  else return !obj
}
