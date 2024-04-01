import { get, isString } from 'lodash-es'
import type { Validator } from './main'
import * as rules from './rules'
import { flattenObject, isEmpty, isValidDate } from './utils'
import type { CbFunction, SimpleObject } from './types'

let missedRuleValidator: CbFunction = function (this: Rule) {
  throw new Error(`Validator \`${this.name}\` is not defined!`)
}
let missedRuleMessage: string | undefined = ''

export class Rule {
  static rules = Object.assign({}, rules) as SimpleObject
  private _customMessage: string | undefined = undefined
  private callback!: CbFunction<void>
  private input: SimpleObject | number | string | undefined
  private passes = false
  private rule: (number | string)[] | number | string | undefined
  private validator!: Validator
  attribute = ''

  constructor(readonly name: string, private readonly fn: VoidFunction, private readonly async: boolean) {
    Rule._setRules()
  }

  _apply(
    input: SimpleObject | number | string,
    rule: SimpleObject,
    attribute: null | string,
    callback?: CbFunction,
  ): any {
    const fn = this.isMissed() ? missedRuleValidator : this.fn
    return fn.apply(this, [input, rule, attribute, callback] as any)
  }

  _getValueType() {
    if (typeof this.input === 'number' || this.validator._hasNumericRule(this.attribute))
      return 'numeric'
    else if (Array.isArray(this.input))
      return 'array'
    return 'string'
  }

  static _setRules() {
    Rule.rules = {
      ...this.rules,
      after(value: string, req: string) {
        const val1 = this.validator.input[req]
        const val2 = value
        if (!isValidDate(val1) || !isValidDate(val2))
          return false

        return new Date(val1).getTime() < new Date(val2).getTime()
      },
      after_or_equal(val: string, req: string) {
        const val1 = this.validator.input[req]
        const val2 = val
        if (!isValidDate(val1) || !isValidDate(val2))
          return false
        return new Date(val1).getTime() <= new Date(val2).getTime()
      },
      before(val: string, req: string) {
        const val1 = this.validator.input[req]
        const val2 = val
        if (!isValidDate(val1) || !isValidDate(val2))
          return false
        return new Date(val1).getTime() > new Date(val2).getTime()
      },
      before_or_equal(val: string, req: string) {
        const val1 = this.validator.input[req]
        const val2 = val
        if (!isValidDate(val1) || !isValidDate(val2))
          return false
        return new Date(val1).getTime() >= new Date(val2).getTime()
      },
      between(_val: string, req: string[]) {
        req = this.getParameters()
        const size = this.getSize()
        const min = Number.parseFloat(req[0])
        const max = Number.parseFloat(req[1])
        return size >= min && size <= max
      },
      confirmed(val: string, _req: string, attribute: string) {
        const confirmedKey = `${attribute}_confirmation`
        return this.validator.input[confirmedKey] === val
      },
      different(val: string, req: string) {
        const val1 = flattenObject(this.validator.input)[req]
        return val1 !== val
      },
      digits(val: SimpleObject, req: string) {
        const numericRule = this.validator.getRule('numeric')
        return !!(numericRule.validate(val, {}) && String(val).trim().length === Number.parseInt(req))
      },
      digits_between(val: number) {
        const numericRule = this.validator.getRule('numeric')
        const req = this.getParameters()
        const min = Number.parseFloat(req[0])
        const max = Number.parseFloat(req[1])
        return numericRule.validate(val, {}) && val >= min && val <= max
      },
      in(val: string | string[]) {
        let list: (number | string)[] = []
        if (!isEmpty(val))
          list = this.getParameters()
        if (!isEmpty(val) && !(Array.isArray(val))) {
          let localValue = val
          for (const li of list) {
            if (typeof li === 'string')
              localValue = String(val)
            if (localValue === li)
              return true
          }
          return false
        }
        if (val && Array.isArray(val)) {
          for (const va of val) {
            if (!list.includes(va))
              return false
          }
        }
        return true
      },
      ip(val: string, req: number, attribute: string) {
        return Rule.rules.ipv4(val, req, attribute) || Rule.rules.ipv6(val, req, attribute)
      },
      max(val: string, req: number) {
        const value = this.validator._hasRule(this.attribute, ['email']) && val.includes('@') ? val.split('@')[0] : val
        return this.getSize(value) <= req
      },
      min(val: string, req: number) {
        const value = this.validator._hasRule(this.attribute, ['email']) && val.includes('@') ? val.split('@')[0] : val
        return this.getSize(value) >= req
      },
      not_in(val: string) {
        const list: (number | string)[] = this.getParameters()
        let returnVal = true

        for (const li of list) {
          let localValue = val

          if (typeof li === 'string')
            localValue = String(val)

          if (localValue === li) {
            returnVal = false
            break
          }
        }
        return returnVal
      },
      required_if(val: SimpleObject, req: string[]) {
        req = this.getParameters()
        if (get(this.validator.input, req[0]) === req[1])
          return this.validator.getRule('required').validate(val, {})

        return true
      },
      required_unless(val: SimpleObject, req: string[]) {
        req = this.getParameters()
        if (get(this.validator.input, req[0]) !== req[1])
          return this.validator.getRule('required').validate(val, {})

        return true
      },
      required_with(val: SimpleObject, req: string) {
        if (get(this.validator.input, req))
          return this.validator.getRule('required').validate(val, {})

        return true
      },
      required_with_all(val: SimpleObject, req: string[]) {
        req = this.getParameters()

        for (const re of req) {
          if (!get(this.validator.input, re))
            return true
        }

        return this.validator.getRule('required').validate(val, {})
      },
      required_without(val: SimpleObject, req: string) {
        if (get(this.validator.input, req))
          return true

        return this.validator.getRule('required').validate(val, {})
      },
      required_without_all(val: SimpleObject, req: string) {
        req = this.getParameters()

        for (const re of req) {
          if (get(this.validator.input, re))
            return true
        }

        return this.validator.getRule('required').validate(val, {})
      },
      same(val: string, req: string) {
        const val1 = flattenObject(this.validator.input)[req]
        return val1 === val
      },
      size(val: string, req: number | string) {
        if (!val)
          return false
        req = Number.parseFloat(String(req))
        const size = this.getSize()
        return size === req
      },
    }
  }

  _setValidatingData(attribute: string, input: SimpleObject | number | string, rule: any) {
    this.attribute = attribute
    this.input = input
    this.rule = rule
  }

  get customMessages() {
    return this.isMissed() ? missedRuleMessage : this._customMessage
  }

  getParameters() {
    let value: (number | string)[] = []
    if (!this.rule)
      return value

    if (isString(this.rule))
      value = this.rule.split(',')

    if (Array.isArray(this.rule))
      value = this.rule

    if (!Number.isNaN(Number.parseFloat(this.rule as string)) && Number.isFinite(this.rule)) {
      this.rule = Number.parseFloat(this.rule as string)
      value.push(this.rule)
    }

    return value
  }

  getSize(value?: Array<number | string> | number | string): number | string {
    const input = value || this.input
    if (Array.isArray(input))
      return input.length

    if (typeof input === 'number')
      return input

    if (this.validator._hasNumericRule(this.attribute))
      return Number.parseFloat(input as string)

    return (input as string).length
  }

  isMissed() {
    return typeof this.fn !== 'function'
  }

  response(passes: boolean | undefined, message?: string) {
    this.passes = passes === undefined || passes
    this._customMessage = message
    this.callback(this.passes, message)
  }

  setValidator(validator: Validator) {
    this.validator = validator
  }

  validate(input: SimpleObject | number | string, rule: SimpleObject, attribute = '', callback?: CbFunction) {
    this._setValidatingData(attribute, input, rule)
    if (typeof callback === 'function') {
      this.callback = callback
      const handleResponse = (passes?: boolean, message?: string) => {
        return this.response(passes, message)
      }
      if (this.async)
        return this._apply(input, rule, attribute, handleResponse)
      else
        return handleResponse(this._apply(input, rule, attribute))
    }
    return this._apply(input, rule, attribute)
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

  isAsync(name: string) {
    for (const rule of this.asyncRules) {
      if (rule === name)
        return true
    }
    return false
  }

  isImplicit(name: string) {
    return this.implicitRules.includes(name)
  }

  make(name: string, validator: Validator) {
    Rule._setRules()
    const isAsync = this.isAsync(name)
    const rule = new Rule(name, Rule.rules[name], isAsync)
    rule.setValidator(validator)
    return rule
  }

  register(name: string, fn: CbFunction) {
    Rule.rules[name] = fn
  }

  registerAsync(name: string, fn: CbFunction) {
    this.register(name, fn)
    this.asyncRules.push(name)
  }

  registerAsyncImplicit(name: string, fn: CbFunction) {
    this.registerImplicit(name, fn)
    this.asyncRules.push(name)
  }

  registerImplicit(name: string, fn: CbFunction) {
    this.register(name, fn)
    this.implicitRules.push(name)
  }

  registerMissedRuleValidator(fn: CbFunction, message?: string) {
    missedRuleValidator = fn
    missedRuleMessage = message
  }
}
