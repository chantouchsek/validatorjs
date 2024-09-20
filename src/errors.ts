import type { SimpleObject } from './types'
import { cloneDeep, get, omit } from 'lodash-es'
import { is, toCamelCase, toSnakeCase } from './utils'

export default class Errors {
  private errors: SimpleObject<string[]> = {}

  private _getFields(field: string | string[]): string[] {
    const fields: string[] = []
    const attributes = Array.isArray(field) ? field : [field]
    for (const f of attributes)
      fields.push(toCamelCase(f), toSnakeCase(f))

    return [...new Set(fields)].filter(Boolean)
  }

  add(field: string, message: string | string[], forceUpdate?: boolean) {
    const messages = Array.isArray(message) ? message : [message]
    this.errors[field] = this.errors[field] || []

    if (forceUpdate || this.errors[field].every(s => !messages.includes(s)))
      this.errors[field] = [...messages, ...this.errors[field]]
  }

  all() {
    return this.errors
  }

  clear(attribute?: string | string[]) {
    if (!attribute)
      return this.flush()
    const errors = omit(cloneDeep(this.errors), attribute)
    this.fill(errors)
  }

  fill(errors: SimpleObject<string[]>) {
    this.errors = Object.assign({}, errors)
  }

  first(field: string | string[]) {
    const fields = this._getFields(field)
    const errorField = fields.find(f => f in this.errors) ?? field
    return this.get(errorField)[0]
  }

  flush() {
    this.fill({})
  }

  get(field: string | string[]) {
    const fields = Array.isArray(field) ? field : [field]
    return fields.find(f => this.has(f)) ? get(this.errors, fields.find(f => this.has(f)) || '', []) : []
  }

  has(field: string | string[]) {
    const fields = this._getFields(field)
    return is(Object.keys(this.errors), fields)
  }

  missed(field: string | string[]) {
    return !this.has(field)
  }

  onKeydown(event: KeyboardEvent) {
    const { name } = event.target as HTMLInputElement
    if (!name)
      return

    this.clear(name)
  }
}
