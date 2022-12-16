import type Validator from './main'
import * as rules from './rules'
import { flattenObject, isEmpty, isValidDate, objectPath } from './utils'

let missedRuleValidator: VoidFunction = function (this: Rule) {
  throw new Error('Validator `' + this.name + '` is not defined!')
}
let missedRuleMessage: string | undefined = ''

export class Rule {
  private readonly async: boolean
  private _customMessage: string | undefined
  private passes: boolean
  private readonly fn: VoidFunction
  readonly name: string
  private callback: any
  attribute: string
  private input: Record<string, any> | string | number | undefined
  private rule: any
  private validator!: Validator
  static rules: any = rules

  constructor(name: string, fn: VoidFunction, async: boolean) {
    this.name = name
    this.fn = fn
    this.passes = false
    this._customMessage = undefined
    this.async = async
    Rule._setRules()
    this.attribute = ''
  }

  validate(input: Record<string, any> | string | number, rule: Record<string, any>, attribute = '', callback = null) {
    this._setValidatingData(attribute, input, rule)
    if (typeof callback === 'function') {
      this.callback = callback
      const handleResponse = (passes?: boolean, message?: string) => {
        return this.response(passes, message)
      }
      if (this.async) {
        return this._apply(input, rule, attribute, handleResponse as unknown as null)
      } else {
        return handleResponse(this._apply(input, rule, attribute))
      }
    }
    return this._apply(input, rule, attribute)
  }

  _apply(
    input: Record<string, any> | string | number,
    rule: Record<string, any>,
    attribute: string | null,
    callback = null,
  ): any {
    const fn = this.isMissed() ? missedRuleValidator : this.fn
    return fn.apply(this, [input, rule, attribute, callback] as any)
  }

  _setValidatingData(attribute: string, input: Record<string, any> | string | number, rule: any) {
    this.attribute = attribute
    this.input = input
    this.rule = rule
  }

  getParameters() {
    let value = []
    if (!isNaN(parseFloat(this.rule)) && isFinite(this.rule)) {
      this.rule = parseFloat(this.rule)
      value.push(this.rule)
    }
    if (typeof this.rule === 'string') {
      value = this.rule.split(',')
    }
    if (this.rule instanceof Array) {
      value = this.rule
    }
    return value
  }

  getSize(value?: string | number | Array<string | number>): string | number {
    const input = value || this.input
    if (input instanceof Array) {
      return input.length
    }
    if (typeof input === 'number') {
      return input
    }
    if (this.validator._hasNumericRule(this.attribute)) {
      return parseFloat(input as string)
    }
    return (input as string).length
  }

  _getValueType() {
    if (typeof this.input === 'number' || this.validator._hasNumericRule(this.attribute as string)) {
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

  static _setRules() {
    Rule.rules = {
      ...this.rules,
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
        if (!isValidDate(val1) || !isValidDate(val2)) return false
        return new Date(val1).getTime() <= new Date(val2).getTime()
      },
      required_if(val: Record<string, any>, req: string[]) {
        req = this.getParameters()
        if (objectPath(this.validator.input, req[0]) === req[1]) {
          return this.validator.getRule('required').validate(val, {})
        }

        return true
      },
      required_unless(val: Record<string, any>, req: string[]) {
        req = this.getParameters()
        if (objectPath(this.validator.input, req[0]) !== req[1]) {
          return this.validator.getRule('required').validate(val, {})
        }

        return true
      },
      required_with(val: Record<string, any>, req: string) {
        if (objectPath(this.validator.input, req)) {
          return this.validator.getRule('required').validate(val, {})
        }
        return true
      },
      required_with_all(val: Record<string, any>, req: string[]) {
        req = this.getParameters()

        for (const re of req) {
          if (!objectPath(this.validator.input, re)) return true
        }

        return this.validator.getRule('required').validate(val, {})
      },
      required_without(val: Record<string, any>, req: string) {
        if (objectPath(this.validator.input, req)) {
          return true
        }

        return this.validator.getRule('required').validate(val, {})
      },
      required_without_all(val: Record<string, any>, req: string) {
        req = this.getParameters()

        for (const re of req) {
          if (objectPath(this.validator.input, re)) {
            return true
          }
        }

        return this.validator.getRule('required').validate(val, {})
      },
      size(val: string, req: number | string) {
        if (!val) return false
        req = parseFloat(String(req))
        const size = this.getSize()
        return size === req
      },
      min(val: string, req: number | string) {
        const size: number = this.getSize(val)
        return size >= req
      },
      max(val: string, req: number | string) {
        const size: number = this.getSize(val)
        return size <= req
      },
      between(val: string, req: string[]) {
        req = this.getParameters()
        const size = this.getSize()
        const min = parseFloat(req[0])
        const max = parseFloat(req[1])
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
        if (!isEmpty(val)) {
          list = this.getParameters()
        }
        if (!isEmpty(val) && !(val instanceof Array)) {
          let localValue = val
          for (const li of list) {
            if (typeof li === 'string') {
              localValue = String(val)
            }
            if (localValue === li) {
              return true
            }
          }
          return false
        }
        if (val && val instanceof Array) {
          for (const va of val) {
            if (list.indexOf(va) < 0) {
              return false
            }
          }
        }
        return true
      },
      not_in(val: string) {
        const list: (string | number)[] = this.getParameters()
        let returnVal = true

        for (const li of list) {
          let localValue = val

          if (typeof li === 'string') {
            localValue = String(val)
          }

          if (localValue === li) {
            returnVal = false
            break
          }
        }
        return returnVal
      },
      confirmed(val: string, req: string, attribute: string) {
        const confirmedKey = attribute + '_confirmation'
        return this.validator.input[confirmedKey] === val
      },
      digits(val: Record<string, any>, req: string) {
        const numericRule = this.validator.getRule('numeric')
        return !!(numericRule.validate(val, {}) && String(val).trim().length === parseInt(req))
      },
      digits_between(val: string | number) {
        const numericRule = this.validator.getRule('numeric')
        const req = this.getParameters()
        const min = parseFloat(req[0])
        const max = parseFloat(req[1])
        return numericRule.validate(val, {}) && val >= min && val <= max
      },
      before(val: string, req: string) {
        const val1 = this.validator.input[req]
        const val2 = val
        if (!isValidDate(val1) || !isValidDate(val2)) {
          return false
        }
        return new Date(val1).getTime() > new Date(val2).getTime()
      },
      before_or_equal(val: string, req: string) {
        const val1 = this.validator.input[req]
        const val2 = val
        if (!isValidDate(val1) || !isValidDate(val2)) {
          return false
        }
        return new Date(val1).getTime() >= new Date(val2).getTime()
      },
      ip(val: string, req: number, attribute: string) {
        return Rule.rules['ipv4'](val, req, attribute) || Rule.rules['ipv6'](val, req, attribute)
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
      if (rule === name) {
        return true
      }
    }
    return false
  }

  isImplicit(name: string) {
    return this.implicitRules.indexOf(name) > -1
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
