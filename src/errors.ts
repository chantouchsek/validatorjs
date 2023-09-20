import { cloneDeep, get, omit } from 'lodash'
import type { SimpleObject } from './types'
import { is, toCamelCase, toSnakeCase } from './utils'

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

  get(field: string | string[]) {
    const fields = Array.isArray(field) ? field : [field]
    for (const f of fields) {
      if (this.has(f))
        return get(this.errors, f, [])
    }
    return []
  }

  first(field: string | string[]): string | undefined {
    if (Array.isArray(field)) {
      const fields = this._getFields(field)
      let fd = ''
      for (const f of fields) {
        if (this.has(f)) {
          fd = f
          break
        }
      }
      return this.first(fd)
    }
    else {
      return this.get(field)[0]
    }
  }

  all() {
    return this.errors
  }

  has(field: string | string[]) {
    const fields = this._getFields(field)
    return is(Object.keys(this.errors), fields)
  }

  fill(errors: SimpleObject<string[]>) {
    this.errors = Object.assign({}, errors)
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

  onKeydown(event: KeyboardEvent) {
    const { name } = event.target as HTMLInputElement
    if (!name)
      return

    this.clear(name)
  }

  private _getFields(field: string | string[]): string[] {
    const fields: string[] = []
    const attributes = Array.isArray(field) ? field : [field]
    for (const f of attributes)
      fields.push(toCamelCase(f), toSnakeCase(f))

    return [...new Set(fields)].filter(Boolean)
  }
}
