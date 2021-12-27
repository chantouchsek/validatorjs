import Validator from './main'
import * as rules from './rules'
import { isValidDate } from './utils/date'

let missedRuleValidator = function (this: Rule) {
  throw new Error('Validator `' + this.name + '` is not defined!')
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
  static rules: any = rules

  constructor(name: string, fn: any, async: boolean) {
    this.name = name
    this.fn = fn
    this.passes = false
    this._customMessage = undefined
    this.async = async
    Rule._setRules()
    this.attribute = ''
  }

  validate(
    input: Record<string, any>,
    rule: any,
    attribute = '',
    callback = null,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this
    this._setValidatingData(attribute, input, rule)
    if (typeof callback === 'function') {
      this.callback = callback
      const handleResponse = (passes?: boolean, message?: string) => {
        return _this.response(passes, message)
      }
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
    const fn = this.isMissed() ? missedRuleValidator : this.fn
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

  static _setRules() {
    Rule.rules = {
      ...Rule.rules,
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
      required_if(val: Record<string, any>, req: string[]) {
        req = this.getParameters()
        if (
          this.validator._objectPath(this.validator.input, req[0]) === req[1]
        ) {
          return this.validator.getRule('required').validate(val, {})
        }

        return true
      },
      required_unless(val: Record<string, any>, req: string[]) {
        req = this.getParameters()
        if (
          this.validator._objectPath(this.validator.input, req[0]) !== req[1]
        ) {
          return this.validator.getRule('required').validate(val, {})
        }

        return true
      },
      required_with(val: Record<string, any>, req: string) {
        if (this.validator._objectPath(this.validator.input, req)) {
          return this.validator.getRule('required').validate(val, {})
        }

        return true
      },
      required_with_all(val: Record<string, any>, req: string[]) {
        req = this.getParameters()

        for (let i = 0; i < req.length; i++) {
          if (!this.validator._objectPath(this.validator.input, req[i])) {
            return true
          }
        }

        return this.validator.getRule('required').validate(val, {})
      },
      required_without(val: Record<string, any>, req: string) {
        if (this.validator._objectPath(this.validator.input, req)) {
          return true
        }

        return this.validator.getRule('required').validate(val, {})
      },
      required_without_all(val: Record<string, any>, req: string) {
        req = this.getParameters()

        for (let i = 0; i < req.length; i++) {
          if (this.validator._objectPath(this.validator.input, req[i])) {
            return true
          }
        }

        return this.validator.getRule('required').validate(val, {})
      },
      boolean(val: boolean | string | number) {
        return (
          val === true ||
          val === false ||
          val === 0 ||
          val === 1 ||
          val === '0' ||
          val === '1' ||
          val === 'true' ||
          val === 'false'
        )
      },
      size(val: string, req: number | string) {
        if (val) {
          req = parseFloat(String(req))

          const size = this.getSize()

          return size === req
        }

        return true
      },
      string(val: unknown) {
        return typeof val === 'string'
      },
      sometimes() {
        return true
      },
      max(val: string, req: number) {
        const size = this.getSize()
        return size <= req
      },
      between(val: string, req: string[]) {
        req = this.getParameters()
        const size = this.getSize()
        const min = parseFloat(req[0])
        const max = parseFloat(req[1])
        return size >= min && size <= max
      },
      email(val: string) {
        let re =
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!re.test(val)) {
          re =
            // eslint-disable-next-line no-control-regex
            /^((?:[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]|[^\u0000-\u007F])+@(?:[a-zA-Z0-9]|[^\u0000-\u007F])(?:(?:[a-zA-Z0-9-]|[^\u0000-\u007F]){0,61}(?:[a-zA-Z0-9]|[^\u0000-\u007F]))?(?:\.(?:[a-zA-Z0-9]|[^\u0000-\u007F])(?:(?:[a-zA-Z0-9-]|[^\u0000-\u007F]){0,61}(?:[a-zA-Z0-9]|[^\u0000-\u007F]))?)+)*$/
        }
        return re.test(val)
      },
      numeric(val: string | number | boolean) {
        const num = Number(val) // tries to convert value to a number. useful if value is coming from form element
        return !isNaN(num) && typeof val !== 'boolean'
      },
      url(url: string) {
        return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_\+.~#?&/=]*)/i.test(
          url,
        )
      },
      same(val: string, req: string) {
        const val1 = this.validator._flattenObject(this.validator.input)[req]
        return val1 === val
      },
      different(val: string, req: string) {
        const val1 = this.validator._flattenObject(this.validator.input)[req]
        return val1 !== val
      },
      in(val: string | string[]) {
        let list
        let i
        if (val) {
          list = this.getParameters()
        }
        if (val && !(val instanceof Array)) {
          let localValue = val
          for (i = 0; i < list.length; i++) {
            if (typeof list[i] === 'string') {
              localValue = String(val)
            }
            if (localValue === list[i]) {
              return true
            }
          }
          return false
        }
        if (val && val instanceof Array) {
          for (i = 0; i < val.length; i++) {
            if (list.indexOf(val[i]) < 0) {
              return false
            }
          }
        }
        return true
      },
      not_in(val: string) {
        const list = this.getParameters()
        const len = list.length
        let returnVal = true

        for (let i = 0; i < len; i++) {
          let localValue = val

          if (typeof list[i] === 'string') {
            localValue = String(val)
          }

          if (localValue === list[i]) {
            returnVal = false
            break
          }
        }
        return returnVal
      },
      confirmed(val: string, req: string, key: string) {
        const confirmedKey = key + '_confirmation'
        return this.validator.input[confirmedKey] === val
      },
      integer(val: string) {
        return String(parseInt(val, 10)) === String(val)
      },
      digits(val: Record<string, any>, req: string) {
        const numericRule = this.validator.getRule('numeric')
        return !!(
          numericRule.validate(val, {}) &&
          String(val.trim()).length === parseInt(req)
        )
      },
      digits_between(val: Record<string, any>) {
        const numericRule = this.validator.getRule('numeric')
        const req = this.getParameters()
        const valueDigitsCount = String(val).length
        const min = parseFloat(req[0])
        const max = parseFloat(req[1])
        return !!(
          numericRule.validate(val, {}) &&
          valueDigitsCount >= min &&
          valueDigitsCount <= max
        )
      },
      regex(val: string, req: any) {
        const mod = /[g|i|m]{1,3}$/
        let flag = req.match(mod)
        flag = flag ? flag[0] : ''
        req = req.replace(mod, '').slice(1, -1)
        req = new RegExp(req, flag)
        return req.test(val)
      },
      date(val: string) {
        return isValidDate(val)
      },
      present(val?: string) {
        return typeof val !== 'undefined'
      },
      before(val: string, req: string) {
        const val1 = this.validator.input[req]
        const val2 = val

        if (!isValidDate(val1)) {
          return false
        }
        if (!isValidDate(val2)) {
          return false
        }

        return new Date(val1).getTime() > new Date(val2).getTime()
      },
      before_or_equal(val: string, req: string) {
        const val1 = this.validator.input[req]
        const val2 = val
        if (!isValidDate(val1)) {
          return false
        }
        if (!isValidDate(val2)) {
          return false
        }
        return new Date(val1).getTime() >= new Date(val2).getTime()
      },
      hex(val: string) {
        return /^[0-9a-f]+$/i.test(val)
      },
      ipv4(val: string | number) {
        if (typeof val != 'string') return false

        // regex to check that each octet is valid
        const er = /^[0-9]+$/
        // ipv4 octets are delimited by dot
        const octets = val.split('.')
        // check 1: ipv4 address should contains 4 octets
        if (octets.length != 4) return false

        for (let i = 0; i < octets.length; i++) {
          const element = octets[i]
          // check 2: each octet should be integer bigger than 0
          if (!er.test(element)) return false

          // check 3: each octet value should be less than 256
          const octetValue = parseInt(element)
          if (octetValue >= 256) return false
        }

        // if all checks passed, we know it's valid IPv4 address!
        return true
      },
      ipv6(val: string | number) {
        if (typeof val != 'string') return false

        // regex to check that each hextet is valid
        const er = /^[0-9a-f]+$/
        // ipv6 hextets are delimited by colon
        const hextets = val.split(':')

        // check 1: ipv6 should contain only one consecutive colons
        const colons = val.match(/::/)
        const matcher = val.match(/::/g) || ''
        if (colons != null && matcher.length > 1) return false

        // check 2: ipv6 should not be ending or starting with colon
        //          edge case: not with consecutive colons
        if (val[0] == ':' && (colons == null || colons.index != 0)) return false
        if (
          val[val.length - 1] == ':' &&
          (colons == null || colons.index != val.length - 2)
        )
          return false

        // check 3: ipv6 should contain no less than 3 sector
        //         minimum ipv6 addres - ::1
        if (3 > hextets.length) return false

        // check 4: ipv6 should contain no more than 8 sectors
        //         only 1 edge case: when first or last sector is ommited
        const isEdgeCase =
          hextets.length == 9 &&
          colons != null &&
          (colons.index == 0 || colons.index == val.length - 2)
        if (hextets.length > 8 && !isEdgeCase) return false

        // check 5: ipv6 should contain exactly one consecutive colons if it has less than 8 sectors
        if (hextets.length != 8 && colons == null) return false

        for (let i = 0; i < hextets.length; i++) {
          const element = hextets[i]

          if (element.length == 0) continue

          // check 6: all of hextets should contain numbers from 0 to f (in hexadecimal)
          if (!er.test(element)) return false

          // check 7: all of hextet values should be less then ffff (in hexadeimal)
          //          checking using length of hextet. lowest invalid value's length is 5.
          //          so all valid hextets are length of 4 or less
          if (element.length > 4) return false
        }
        return true
      },
      ip(val: string, req: number, attribute: string) {
        return (
          Rule.rules['ipv4'](val, req, attribute) ||
          Rule.rules['ipv6'](val, req, attribute)
        )
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
    const async = this.isAsync(name)
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
