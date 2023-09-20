import { cloneDeep, get, omit } from 'lodash'
import type { SimpleObject } from './types'
import { is, toCamelCase, toSnakeCase } from './utils'

export default class Errors {
  private errors: SimpleObject<string[]> = {}

  add(field: string, message: string | string[], forceUpdate?: boolean) {
    const messages = Array.isArray(message) ? message : [message]
    if (this.missed(field))
      this.errors[field] = []
    if (this.errors[field].every(s => !messages.includes(s)))
      this.errors[field].unshift(...messages)
    if (forceUpdate) {
      this.errors[field] = []
      this.errors[field].push(...messages)
    }
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

  first(field: string | string[]) {
    const fields = this._getFields(field)
    const fd = fields.find(f => f in this.errors)
    const value = this.get(fd ?? field)
    return value[0]
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
