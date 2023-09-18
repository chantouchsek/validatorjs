import { onlyDigits } from '../utils'

export function numeric(value: string | number | boolean) {
  return onlyDigits(value) && !Array.isArray(value)
}
