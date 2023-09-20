import { get } from 'lodash'
import type Validator from './main'
import * as rules from './rules'
import { flattenObject, isEmpty, isValidDate } from './utils'
import type { SimpleObject } from './types'

let missedRuleValidator: VoidFunction = function (this: Rule) {
  throw new Error(`Validator \`${this.name}\` is not defined!`)
}
let missedRuleMessage: string | undefined = ''

export class Rule {
  private _customMessage: string | undefined = undefined
  private passes = false
  private callback: any
  attribute = ''
  private input: SimpleObject | string | number | undefined
  private rule: any
  private validator!: Validator
  static rules = Object.assign({}, rules) as SimpleObject

  constructor(readonly name: string, private readonly fn: VoidFunction, private readonly async: boolean) {
    Rule._setRules()
  }

  validate(input: SimpleObject | string | number, rule: SimpleObject, attribute = '', callback = null) {
    this._setValidatingData(attribute, input, rule)
    if (typeof callback === 'function') {
      this.callback = callback
      const handleResponse = (passes?: boolean, message?: string) => {
        return this.response(passes, message)
      }
      if (this.async)
        return this._apply(input, rule, attribute, handleResponse as unknown as null)
      else
        return handleResponse(this._apply(input, rule, attribute))
    }
    return this._apply(input, rule, attribute)
  }

  _apply(
    input: SimpleObject | string | number,
    rule: SimpleObject,
    attribute: string | null,
    callback = null,
  ): any {
    const fn = this.isMissed() ? missedRuleValidator : this.fn
    return fn.apply(this, [input, rule, attribute, callback] as any)
  }

  _setValidatingData(attribute: string, input: SimpleObject | string | number, rule: any) {
    this.attribute = attribute
    this.input = input
    this.rule = rule
  }

  getParameters() {
    let value = []
    if (!Number.isNaN(Number.parseFloat(this.rule)) && Number.isFinite(this.rule)) {
      this.rule = Number.parseFloat(this.rule)
      value.push(this.rule)
    }
    if (typeof this.rule === 'string')
      value = this.rule.split(',')

    if (Array.isArray(this.rule))
      value = this.rule

    return value
  }

  getSize(value?: string | number | Array<string | number>): string | number {
    const input = value || this.input
    if (Array.isArray(input))
      return input.length

    if (typeof input === 'number')
      return input

    if (this.validator._hasNumericRule(this.attribute))
      return Number.parseFloat(input as string)

    return (input as string).length
  }

  _getValueType() {
    if (typeof this.input === 'number' || this.validator._hasNumericRule(this.attribute as string))
      return 'numeric'

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
      size(val: string, req: number | string) {
        if (!val)
          return false
        req = Number.parseFloat(String(req))
        const size = this.getSize()
        return size === req
      },
      min(val: string, req: number) {
        const size: number = this.getSize(val)
        return size >= req
      },
      max(val: string, req: number) {
        const size: number = this.getSize(val)
        return size <= req
      },
      between(val: string, req: string[]) {
        req = this.getParameters()
        const size = this.getSize()
        const min = Number.parseFloat(req[0])
        const max = Number.parseFloat(req[1])
        return size >= min && size <= max
      },
      same(val: string, req: string) {
        const val1 = flattenObject(this.validator.input)[req]
        return val1 === val
      },
      different(val: string, req: string) {
        const val1 = flattenObject(this.validator.input)[req]
        return val1 !== val
      },
      in(val: string | string[]) {
        let list: (string | number)[] = []
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
      not_in(val: string) {
        const list: (string | number)[] = this.getParameters()
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
      confirmed(val: string, req: string, attribute: string) {
        const confirmedKey = `${attribute}_confirmation`
        return this.validator.input[confirmedKey] === val
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
      ip(val: string, req: number, attribute: string) {
        return Rule.rules.ipv4(val, req, attribute) || Rule.rules.ipv6(val, req, attribute)
      },
    }
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
    Rule._setRules()
    const isAsync = this.isAsync(name)
    const rule = new Rule(name, Rule.rules[name], isAsync)
    rule.setValidator(validator)
    return rule
  }

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

  register(name: string, fn: VoidFunction) {
    Rule.rules[name] = fn
  }

  registerImplicit(name: string, fn: VoidFunction) {
    this.register(name, fn)
    this.implicitRules.push(name)
  }

  registerAsync(name: string, fn: VoidFunction) {
    this.register(name, fn)
    this.asyncRules.push(name)
  }

  registerAsyncImplicit(name: string, fn: VoidFunction) {
    this.registerImplicit(name, fn)
    this.asyncRules.push(name)
  }

  registerMissedRuleValidator(fn: VoidFunction, message?: string) {
    missedRuleValidator = fn
    missedRuleMessage = message
  }
}
