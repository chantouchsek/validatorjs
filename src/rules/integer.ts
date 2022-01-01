import { isArray } from '../utils'

export const integer = (value: string) => {
  return !isArray(value) && String(parseInt(value, 10)) === String(value)
}
