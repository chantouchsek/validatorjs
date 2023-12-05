import { onlyDigits } from '../utils'

export function numeric(value: boolean | number | string) {
  return onlyDigits(value) && !Array.isArray(value)
}
