export function isArray(object: Record<string, any> | any) {
  return Object.prototype.toString.call(object) === '[object Array]'
}
