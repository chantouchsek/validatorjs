export const flattenObject = (obj: Record<string, any> | any = {}) => {
  const flattened: Record<string, any> = {}

  function recurse(current: Record<string, any>, property?: string) {
    if (!property && Object.getOwnPropertyNames(current).length === 0) {
      return
    }
    if (Object(current) !== current || Array.isArray(current)) {
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
