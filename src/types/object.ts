export function hasOwnProperty(
  object?: Record<string, any> | any,
  key?: string | number | symbol,
) {
  if (!object || !key) return false
  return Object.prototype.hasOwnProperty.call(object, key)
}
