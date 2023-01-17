import { isArray } from 'lodash'
import { onlyDigits } from '../utils'

export const numeric = (value: string | number | boolean) => {
  return onlyDigits(value) && !isArray(value)
}
