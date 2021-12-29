import { onlyDigits } from '../utils/string'

export const numeric = (value: string | number | boolean) => {
  return onlyDigits(value)
}
