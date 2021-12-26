export default class Errors {
  private readonly errors: Record<string, any[]> = {}

  constructor() {
    this.errors = {}
  }

  add(attribute: string, message: string) {
    if (!this.has(attribute)) {
      this.errors[attribute] = []
    }
    if (!this.errors[attribute].includes(message)) {
      this.errors[attribute].push(message)
    }
  }

  get(attribute: string) {
    if (this.has(attribute)) {
      return this.errors[attribute][0]
    }
    return []
  }

  first(attribute: string) {
    if (this.has(attribute)) {
      return this.errors[attribute][0] || null
    }
    return false
  }

  all() {
    return this.errors
  }

  has(attribute: string) {
    return this.errors.hasOwnProperty(attribute)
  }
}
