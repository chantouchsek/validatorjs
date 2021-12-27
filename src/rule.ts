import Validator from './main'
import * as rules from './rules'
import { isValidDate } from './utils/date'

let missedRuleValidator = (name: string) => {
  throw new Error('Validator `' + name + '` is not defined!')
}
let missedRuleMessage = ''

export class Rule {
  private readonly async: boolean
  private _customMessage: any
  private passes: boolean
  private readonly fn: any
  readonly name: string
  private callback: any
  attribute: string
  private input: any
  private rule: any
  private validator?: Validator
  static rules: any = {}

  constructor(name: string, rule: (...arg: any[]) => any, async: boolean) {
    this.name = name
    this.fn = rule
    this.passes = false
    this._customMessage = undefined
    this.async = async
    Rule._setRules()
    this.attribute = ''
  }

  static _setRules() {
    Rule.rules = {
      ...rules,
      after(value: string, req: string) {
        const val1 = this.validator.input[req]
        const val2 = value
        if (!isValidDate(val1) || !isValidDate(val2)) {
          return false
        }
        return new Date(val1).getTime() < new Date(val2).getTime()
      },
      after_or_equal(val: string, req: string) {
        const val1 = this.validator.input[req]
        const val2 = val
        if (!isValidDate(val1) || !isValidDate(val2)) {
          return false
        }
        return new Date(val1).getTime() <= new Date(val2).getTime()
      },
      min(value: any, req: number | string) {
        const size = this.getSize(value)
        return size >= req
      },
    }
  }

  validate(
    input: Record<string, any>,
    rule: any,
    attribute: string,
    callback = null,
  ) {
    this._setValidatingData(attribute, input, rule)
    if (typeof callback === 'function') {
      this.callback = callback
      const handleResponse = (passes?: boolean, message?: string) =>
        this.response(passes, message)
      if (this.async) {
        return this._apply(
          input,
          rule,
          attribute,
          handleResponse as unknown as null,
        )
      } else {
        return handleResponse(this._apply(input, rule, attribute))
      }
    }
    return this._apply(input, rule, attribute)
  }

  _apply(
    input: Record<string, any>,
    rule: any,
    attribute: string | null,
    callback = null,
  ) {
    const fn = this.isMissed() ? missedRuleValidator(this.name) : this.fn
    return fn.apply(this, [input, rule, attribute, callback])
  }

  _setValidatingData(attribute: string, input: Record<string, any>, rule: any) {
    this.attribute = attribute
    this.input = input
    this.rule = rule
  }

  getParameters() {
    let value = []
    if (typeof this.rule === 'string') {
      value = this.rule.split(',')
    }
    if (typeof this.rule === 'number') {
      value.push(this.rule)
    }
    if (this.rule instanceof Array) {
      value = this.rule
    }
    return value
  }

  getSize(value?: any) {
    const input = value || this.input
    if (input instanceof Array) {
      return input.length
    }
    if (typeof input === 'number') {
      return input
    }
    if (this.validator?._hasNumericRule(this.attribute as string)) {
      return parseFloat(input)
    }
    return input.length
  }

  _getValueType() {
    if (
      typeof this.input === 'number' ||
      this.validator?._hasNumericRule(this.attribute as string)
    ) {
      return 'numeric'
    }
    return 'string'
  }

  response(passes: boolean | undefined, message?: string) {
    this.passes = passes === undefined || passes
    this._customMessage = message
    this.callback(this.passes, message)
  }

  setValidator(validator: Validator) {
    this.validator = validator
  }

  isMissed() {
    return typeof this.fn !== 'function'
  }

  get customMessages() {
    return this.isMissed() ? missedRuleMessage : this._customMessage
  }
}

export class Manager {
  asyncRules: string[] = []
  implicitRules = [
    'present',
    'required',
    'accepted',
    'required_if',
    'required_with',
    'required_unless',
    'required_without',
    'required_with_all',
    'required_without_all',
  ]

  make(name: string, validator: Validator) {
    const async = this.isAsync(name)
    Rule._setRules()
    const rule = new Rule(name, Rule.rules[name], async)
    rule.setValidator(validator)
    return rule
  }

  isAsync(name: string) {
    for (let i = 0, len = this.asyncRules.length; i < len; i++) {
      if (this.asyncRules[i] === name) {
        return true
      }
    }
    return false
  }

  isImplicit(name: string) {
    return this.implicitRules.indexOf(name) > -1
  }

  register(name: string, fn: any) {
    Rule.rules[name] = fn
  }

  registerImplicit(name: string, fn: any) {
    this.register(name, fn)
    this.implicitRules.push(name)
  }

  registerAsync(name: string, fn: any) {
    this.register(name, fn)
    this.asyncRules.push(name)
  }

  registerAsyncImplicit(name: string, fn: any) {
    this.registerImplicit(name, fn)
    this.asyncRules.push(name)
  }

  registerMissedRuleValidator(fn: any, message: string) {
    missedRuleValidator = fn
    missedRuleMessage = message
  }
}
