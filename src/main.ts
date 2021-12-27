import Lang from './lang'
import Messages from './messages'
import Errors from './errors'
import { Manager, Rule } from './rule'
import AsyncResolvers from './async-resolvers'
import type { ValidatorOptions } from '../types/validator'
import { hasOwnProperty } from '../types/object'
import { formatter } from './utils/string'

export default class Validator {
  readonly input: Record<string, any> = {}
  readonly messages: Messages
  readonly errors: Errors
  errorCount: number
  hasAsync: boolean
  static lang = 'en'
  readonly numericRules = ['integer', 'numeric']
  public rules: Record<string, any> = {}
  stopOnAttributes: any
  static attributeFormatter = formatter
  readonly options?: ValidatorOptions
  static manager = new Manager()

  constructor(
    input?: Record<string, any> | null,
    rules?: Record<string, any>,
    options?: ValidatorOptions,
  ) {
    this.options = options || {}
    const { customMessages, locale } = this.options
    const lang = locale || Validator.getDefaultLang()
    this.input = input || {}
    this.messages = Lang._make(lang)
    this.messages._setCustom(customMessages)
    this.setAttributeFormatter(Validator.attributeFormatter)
    this.errors = new Errors()
    this.errorCount = 0
    this.hasAsync = false
    this.rules = this._parseRules(rules)
  }

  check() {
    for (const attribute in this.rules) {
      const attributeRules = this.rules[attribute]
      const inputValue = this._objectPath(this.input, attribute)
      const findRules = ['sometimes']
      const hasRule = this._hasRule(attribute, findRules)
      if (hasRule && !this._suppliedWithData(attribute)) {
        continue
      }

      for (
        let i = 0,
          len = attributeRules.length,
          rule: Rule,
          ruleOptions,
          rulePassed;
        i < len;
        i++
      ) {
        ruleOptions = attributeRules[i]
        rule = this.getRule(ruleOptions.name)

        if (!this._isValidatable(rule, inputValue)) {
          continue
        }

        rulePassed = rule.validate(inputValue, ruleOptions.value, attribute)
        if (!rulePassed) {
          this._addFailure(rule)
        }

        if (this._shouldStopValidating(attribute, rulePassed)) {
          break
        }
      }
    }

    return this.errorCount === 0
  }

  checkAsync(passes?: boolean | (() => void), fails?: any) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    passes = passes || function () {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    fails = fails || function () {}
    const failsOne = (rule: Rule) => this._addFailure(rule)
    const resolvedAll = function (allPassed: boolean) {
      if (allPassed && typeof passes === 'function') {
        passes()
      } else {
        fails()
      }
    }

    const asyncResolvers = new AsyncResolvers(failsOne, resolvedAll)

    const validateRule = function (
      inputValue: Record<string, any>,
      ruleOptions: Record<string, any>,
      attribute: string,
      rule: Record<string, any>,
    ) {
      return function () {
        const resolverIndex = asyncResolvers.add(rule)
        rule.validate(inputValue, ruleOptions.value, attribute, function () {
          asyncResolvers.resolve(resolverIndex)
        })
      }
    }

    for (const attribute in this.rules) {
      const attributeRules = this.rules[attribute]
      const inputValue = this._objectPath(this.input, attribute)

      if (
        this._hasRule(attribute, ['sometimes']) &&
        !this._suppliedWithData(attribute)
      ) {
        continue
      }

      for (
        let i = 0, len = attributeRules.length, rule, ruleOptions;
        i < len;
        i++
      ) {
        ruleOptions = attributeRules[i]

        rule = this.getRule(ruleOptions.name)

        if (!this._isValidatable(rule, inputValue)) {
          continue
        }

        validateRule(inputValue, ruleOptions, attribute, rule)()
      }
    }

    asyncResolvers.enableFiring()
    asyncResolvers.fire()
  }

  _parseRules(rules: Record<string, any> = {}) {
    const parsedRules: Record<string, any> = {}
    rules = this._flattenObject(rules)

    for (const attribute in rules) {
      const rulesArray = rules[attribute]

      this._parseRulesCheck(attribute, rulesArray, parsedRules)
    }
    return parsedRules
  }

  static setMessages(lang: string, messages: Record<string, any>) {
    Lang._set(lang, messages)
    return this
  }

  static getMessages(lang: string) {
    return Lang._get(lang)
  }

  static useLang(lang: string) {
    Validator.lang = lang
  }

  static getDefaultLang() {
    return this.lang
  }

  static setAttributeFormatter(func: any) {
    this.attributeFormatter = func
  }

  setAttributeFormatter(func: any) {
    this.messages._setAttributeFormatter(func)
  }

  _hasRule(attribute: string, findRules: string[]) {
    const rules = this.rules[attribute] || []
    for (let i = 0, len = rules.length; i < len; i++) {
      if (findRules.indexOf(rules[i].name) > -1) {
        return true
      }
    }
    return false
  }

  _objectPath(obj: Record<string, any>, path: string) {
    if (hasOwnProperty(obj, path)) {
      return obj[path]
    }

    const keys = path
      .replace(/\[(\w+)\]/g, '.$1')
      .replace(/^\./, '')
      .split('.')
    let copy: Record<string, any> = {}
    for (const attr in obj) {
      if (hasOwnProperty(obj, attr)) {
        copy[attr] = obj[attr]
      }
    }

    for (let i = 0, l = keys.length; i < l; i++) {
      if (
        typeof copy === 'object' &&
        copy !== null &&
        hasOwnProperty(copy, keys[i])
      ) {
        copy = copy[keys[i]]
      } else {
        return
      }
    }
    return copy
  }

  _suppliedWithData(attribute: string) {
    return hasOwnProperty(this.input, attribute)
  }

  getRule(name: string): Rule {
    return Validator.manager.make(name, this)
  }

  _isValidatable(rule: Record<string, any>, value: any) {
    if (Array.isArray(value)) {
      return true
    }
    if (Validator.manager.isImplicit(rule.name)) {
      return true
    }

    return this.getRule('required').validate(value, {})
  }

  _addFailure(rule: Rule) {
    const msg = this.messages.render(rule)
    this.errors.add(rule.attribute, msg)
    this.errorCount++
  }

  _shouldStopValidating(attribute: string, rulePassed: any) {
    const stopOnAttributes = this.stopOnAttributes
    if (
      typeof stopOnAttributes === 'undefined' ||
      stopOnAttributes === false ||
      rulePassed === true
    ) {
      return false
    }

    if (stopOnAttributes instanceof Array) {
      return stopOnAttributes.indexOf(attribute) > -1
    }

    return true
  }

  _flattenObject(obj: Record<string, any> | any = {}) {
    const flattened: Record<string, any> = {}

    function recurse(current: Record<string, any>, property?: string) {
      if (!property && Object.getOwnPropertyNames(current).length === 0) {
        return
      }
      if (Object(current) !== current || Array.isArray(current)) {
        flattened[property as string] = current
      } else {
        let isEmpty = true
        for (const p in current) {
          isEmpty = false
          recurse(current[p], property ? property + '.' + p : p)
        }
        if (isEmpty) {
          flattened[property as string] = {}
        }
      }
    }

    if (obj) {
      recurse(obj)
    }
    return flattened
  }

  _parseRulesCheck(
    attribute: string,
    rulesArray: Record<string, any>,
    parsedRules: Record<string, any>,
    wildCardValues?: any[],
  ) {
    if (attribute.indexOf('*') > -1) {
      this._parsedRulesRecurse(
        attribute,
        rulesArray,
        parsedRules,
        wildCardValues,
      )
    } else {
      this._parseRulesDefault(
        attribute,
        rulesArray,
        parsedRules,
        wildCardValues,
      )
    }
  }

  _parsedRulesRecurse(
    attribute: string,
    rulesArray: Record<any, string>,
    parsedRules: Record<string, any>,
    wildCardValues?: any,
  ) {
    const parentPath = attribute.substr(0, attribute.indexOf('*') - 1)
    const propertyValue = this._objectPath(this.input, parentPath)

    if (propertyValue) {
      for (
        let propertyNumber = 0;
        propertyNumber < propertyValue.length;
        propertyNumber++
      ) {
        const workingValues = wildCardValues ? wildCardValues.slice() : []
        workingValues.push(propertyNumber)
        this._parseRulesCheck(
          attribute.replace('*', String(propertyNumber)),
          rulesArray,
          parsedRules,
          workingValues,
        )
      }
    }
  }

  _parseRulesDefault(
    attribute: string,
    rulesArray: Record<string, any> | any,
    parsedRules: Record<string, any> | any,
    wildCardValues?: any,
  ) {
    const attributeRules = []

    if (rulesArray instanceof Array) {
      rulesArray = this._prepareRulesArray(rulesArray)
    }

    if (typeof rulesArray === 'string') {
      rulesArray = rulesArray.split('|')
    }

    for (let i = 0, len = rulesArray.length, rule; i < len; i++) {
      rule =
        typeof rulesArray[i] === 'string'
          ? this._extractRuleAndRuleValue(rulesArray[i])
          : rulesArray[i]
      if (rule.value) {
        rule.value = this._replaceWildCards(rule.value, wildCardValues)
        this._replaceWildCardsMessages(wildCardValues)
      }

      if (Validator.manager.isAsync(rule.name)) {
        this.hasAsync = true
      }
      attributeRules.push(rule)
    }

    parsedRules[attribute] = attributeRules
  }

  _prepareRulesArray(rulesArray: Record<string, any> | any) {
    const rules: Record<string, any>[] = []

    for (let i = 0, len = rulesArray.length; i < len; i++) {
      if (typeof rulesArray[i] === 'object') {
        for (const rule in rulesArray[i]) {
          rules.push({
            name: rule,
            value: rulesArray[i][rule],
          })
        }
      } else {
        rules.push(rulesArray[i])
      }
    }

    return rules
  }

  _extractRuleAndRuleValue(ruleString: string) {
    const rule: Record<string, any> = {}
    let ruleArray

    rule.name = ruleString

    if (ruleString.indexOf(':') >= 0) {
      ruleArray = ruleString.split(':')
      rule.name = ruleArray[0]
      rule.value = ruleArray.slice(1).join(':')
    }

    return rule
  }

  _replaceWildCards(path: string, nums: string[]) {
    if (!nums) {
      return path
    }

    let path2 = path
    nums.forEach(function (value) {
      if (Array.isArray(path2)) {
        path2 = path2[0]
      }
      const pos = path2.indexOf('*')
      if (pos === -1) {
        return path2
      }
      path2 = path2.substr(0, pos) + value + path2.substr(pos + 1)
    })
    if (Array.isArray(path)) {
      path[0] = path2
      path2 = path
    }
    return path2
  }

  _replaceWildCardsMessages(nums: string[]) {
    const customMessages = this.messages.customMessages
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    Object.keys(customMessages).forEach((key) => {
      if (nums) {
        const newKey = self._replaceWildCards(key, nums)
        customMessages[newKey] = customMessages[key]
      }
    })

    this.messages._setCustom(customMessages)
  }

  _hasNumericRule(attribute: string) {
    return this._hasRule(attribute, this.numericRules)
  }

  setAttributeNames(attributes: Record<string, any>) {
    this.messages._setAttributeNames(attributes)
  }

  stopOnError(attributes: Record<string, any> | boolean) {
    this.stopOnAttributes = attributes
  }

  static stopOnError(attributes: Record<string, any> | boolean) {
    this.prototype.stopOnAttributes = attributes
  }

  passes(passes?: () => void) {
    const async = this._checkAsync('passes', passes)
    if (async) {
      return this.checkAsync(passes)
    }
    return this.check()
  }

  fails(fails?: boolean | (() => void)) {
    const async = this._checkAsync('fails', fails)
    if (async) {
      return this.checkAsync(false, fails)
    }
    return !this.check()
  }

  _checkAsync(funcName: string, callback?: boolean | (() => void)) {
    const hasCallback = typeof callback === 'function'
    if (this.hasAsync && !hasCallback) {
      throw funcName + ' expects a callback when async rules are being tested.'
    }

    return this.hasAsync || hasCallback
  }

  static register(name: string, fn: any, message = '') {
    const lang = Validator.getDefaultLang()
    this.manager.register(name, fn)
    Lang._setRuleMessage(lang, name, message)
  }

  static registerImplicit(name: string, fn: any, message = '') {
    const lang = Validator.getDefaultLang()
    this.manager.registerImplicit(name, fn)
    Lang._setRuleMessage(lang, name, message)
  }

  static registerAsync(name: string, fn: any, message: string) {
    const lang = Validator.getDefaultLang()
    this.manager.registerAsync(name, fn)
    Lang._setRuleMessage(lang, name, message)
  }

  static registerAsyncImplicit(name: string, fn: any, message: string) {
    const lang = Validator.getDefaultLang()
    this.manager.registerAsyncImplicit(name, fn)
    Lang._setRuleMessage(lang, name, message)
  }

  static registerMissedRuleValidator(fn: any, message = '') {
    this.manager.registerMissedRuleValidator(fn, message)
  }
}
