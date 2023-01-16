import { onlyDigits } from '../utils'
import { isArray } from 'lodash'

export const numeric = (value: string | number | boolean) => {
  return onlyDigits(value) && !isArray(value)
}
