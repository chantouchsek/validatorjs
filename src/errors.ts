import { cloneDeep, get, has, omit } from 'lodash'
import type { SimpleObject } from './types'

export default class Errors {
  private errors: SimpleObject<string[]> = {}

  add(attribute: string, message: string) {
    if (!this.has(attribute))
      this.errors[attribute] = []

    if (!this.errors[attribute].includes(message))
      this.errors[attribute].push(message)
  }

  missed(field: string | string[]) {
    return !this.has(field)
  }

  get(field: string | string[]): string | string[] {
    return get(this.errors, field, [])
  }

  first(attribute: string) {
    if (this.has(attribute))
      return this.get(attribute)[0]

    return undefined
  }

  all() {
    return this.errors
  }

  has(field: string | string[]) {
    return has(this.errors, field)
  }

  fill(errors: Record<string, string[]>) {
    this.errors = errors
  }

  clear(attribute?: string | string[]) {
    if (!attribute)
      return this.flush()
    const errors = omit(cloneDeep(this.errors), attribute)
    this.fill(errors)
  }

  flush() {
    this.fill({})
  }
}
