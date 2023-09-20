import { isEmpty } from '../utils'

export function nullable(val: any) {
  return isEmpty(val)
}
