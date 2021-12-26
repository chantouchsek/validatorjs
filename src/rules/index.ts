import required from './required'
import array from './array'
import type Validator from '../main'
import { RuleName } from '../../types/rule'

let missedRuleValidator = (name: string) => {
  throw new Error('Validator `' + name + '` is not defined!')
}
let missedRuleMessage = ''

const rules = {
  required,
  array,
}

export class Rule {
  private readonly async: boolean
  private _customMessage: any
  private passes: boolean
  private readonly fn: any
  private readonly name: string
  private callback: any
  private attribute: string | null | undefined
  private input: any
  private rule: any
  private validator?: Validator

  constructor(name: string, fn: any, async: boolean) {
    this.name = name
    this.fn = fn
    this.passes = false
    this._customMessage = undefined
    this.async = async
  }

  validate(
    input: Record<string, any>,
    rule: any,
    attribute: string | null,
    callback = null,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this
    this._setValidatingData(attribute, input, rule)
    if (typeof callback === 'function') {
      this.callback = callback
      const handleResponse = (passes?: boolean | undefined, message?: string) =>
        _this.response(passes, message)
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

  _setValidatingData(
    attribute: string | null,
    input: Record<string, any>,
    rule: any,
  ) {
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

  getSize() {
    const value = this.input
    if (value instanceof Array) {
      return value.length
    }
    if (typeof value === 'number') {
      return value
    }
    if (this.validator?._hasNumericRule(this.attribute as string)) {
      return parseFloat(value)
    }
    return value.length
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

  get customMessage() {
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

  make(name: RuleName, validator: Validator) {
    const async = this.isAsync(name)
    const rule = new Rule(name, rules[name], async)
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

  register(name: RuleName, fn: any) {
    rules[name] = fn
  }

  registerImplicit(name: RuleName, fn: any) {
    this.register(name, fn)
    this.implicitRules.push(name)
  }

  registerAsync(name: RuleName, fn: any) {
    this.register(name, fn)
    this.asyncRules.push(name)
  }

  registerAsyncImplicit(name: RuleName, fn: any) {
    this.registerImplicit(name, fn)
    this.asyncRules.push(name)
  }

  registerMissedRuleValidator(fn: any, message: string) {
    missedRuleValidator = fn
    missedRuleMessage = message
  }
}
