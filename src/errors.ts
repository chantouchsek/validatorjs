import { hasOwnProperty } from './utils'

export default class Errors {
  private readonly errors: Record<string, string[]> = {}

  add(attribute: string, message: string) {
    if (!this.has(attribute)) {
      this.errors[attribute] = []
    }
    if (this.errors[attribute].indexOf(message) === -1) {
      this.errors[attribute].push(message)
    }
  }

  get(attribute: string) {
    if (this.has(attribute)) {
      return this.errors[attribute]
    }
    return []
  }

  first(attribute: string): string | boolean {
    if (this.has(attribute)) {
      return this.errors[attribute][0]
    }
    return false
  }

  all() {
    return this.errors
  }

  has(attribute: string) {
    return hasOwnProperty(this.errors, attribute)
  }
}
