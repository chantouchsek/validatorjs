import { isArray } from 'lodash'

export function integer(value: string) {
  return !isArray(value) && String(Number.parseInt(value, 10)) === String(value)
}
