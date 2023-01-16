import { isArray } from 'lodash'

export const integer = (value: string) => {
  return !isArray(value) && String(parseInt(value, 10)) === String(value)
}
