import type Messages from './messages'
import type { Rule } from './rule'
import type { CbFunction, LangTypes, RuleType, SimpleObject, ValidatorOptions } from './types'
import { get, replace } from 'lodash-es'
import AsyncResolvers from './async-resolvers'
import Errors from './errors'
import I18n from './i18n'
import { Manager } from './rule'
import { flattenObject, formatter, hasOwnProperty } from './utils'

export { Errors, LangTypes, RuleType, ValidatorOptions }

export class Validator {
  static attributeFormatter = formatter
  static lang: LangTypes = 'en'
  static manager = new Manager()
  private readonly confirmedReverse: boolean
  errorCount = 0
  readonly errors = new Errors()
  hasAsync = false
  readonly messages: Messages
  readonly numericRules = ['integer', 'numeric']
  stopOnAttributes: boolean | SimpleObject | string[] | undefined

  constructor(
    readonly input: null | SimpleObject,
    readonly rules: SimpleObject = {},
    readonly options: ValidatorOptions = {},
  ) {
    const lang = options.locale || Validator.getDefaultLang()
    Validator.useLang(lang)
    this.messages = I18n._make(lang, get(options.defaultAttributeName, lang))
    this.messages._setCustom(options.customMessages)
    this.messages._setAttributeNames(options.customAttributes ?? {})
    this.messages._setAttributeFormatter(Validator.attributeFormatter)
    this.rules = this._parseRules(rules)
    this.confirmedReverse = options.confirmedReverse ?? false
  }

  static getDefaultLang() {
    return this.lang
  }

  static getMessages(lang: LangTypes) {
    return I18n._get(lang)
  }

  static register(name: string, fn: any, message?: string) {
    const lang = Validator.getDefaultLang()
    this.manager.register(name, fn)
    I18n._setRuleMessage(lang, name, message)
  }

  static registerAsync(name: string, fn: any, message?: string) {
    const lang = Validator.getDefaultLang()
    this.manager.registerAsync(name, fn)
    I18n._setRuleMessage(lang, name, message)
  }

  static registerAsyncImplicit(name: string, fn: any, message?: string) {
    const lang = Validator.getDefaultLang()
    this.manager.registerAsyncImplicit(name, fn)
    I18n._setRuleMessage(lang, name, message)
  }

  static registerImplicit(name: string, fn: any, message?: string) {
    const lang = Validator.getDefaultLang()
    this.manager.registerImplicit(name, fn)
    I18n._setRuleMessage(lang, name, message)
  }

  static registerMissedRuleValidator(fn: any, message?: string) {
    this.manager.registerMissedRuleValidator(fn, message)
  }

  static setAttributeFormatter(func: any) {
    this.attributeFormatter = func
  }

  static setMessages(lang: LangTypes, messages: SimpleObject) {
    I18n._set(lang, messages)
    return this
  }

  static stopOnError(attributes: boolean | SimpleObject) {
    this.prototype.stopOnAttributes = attributes
  }

  static useLang(lang: LangTypes) {
    Validator.lang = lang
  }

  _addFailure(rule: Rule, message = '') {
    const msg = message || this.messages.render(rule)
    this.errors.add(rule.attribute, msg)
    this.errorCount++
  }

  _checkAsync(funcName: string, callback?: (() => void) | boolean) {
    const hasCallback = typeof callback === 'function'
    if (this.hasAsync && !hasCallback) throw new Error(`${funcName} expects a callback when async rules are being tested.`)

    return this.hasAsync || hasCallback
  }

  _extractRuleAndRuleValue(ruleString: SimpleObject | string) {
    if (typeof ruleString !== 'string') return ruleString
    const rule: SimpleObject = {}
    let ruleArray

    rule.name = ruleString

    if (ruleString.includes(':')) {
      ruleArray = ruleString.split(':')
      rule.name = ruleArray[0]
      rule.value = ruleArray.slice(1).join(':')
    }

    return rule
  }

  _hasNumericRule(attribute: string) {
    return this._hasRule(attribute, this.numericRules)
  }

  _hasRule(attribute: string, findRules: string[]) {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    return this.rules[attribute].some(({ name }) => findRules.includes(name))
  }

  _isValidatable(rule: SimpleObject, value: any): boolean {
    if (Array.isArray(value) || Validator.manager.isImplicit(rule.name)) return true

    return this.getRule('required').validate(value, {})
  }

  _onlyInputWithRules(obj?: SimpleObject, keyPrefix?: string) {
    const prefix = keyPrefix || ''
    const values: SimpleObject = JSON.parse(JSON.stringify(obj === undefined ? this.input : obj))

    for (const key of Object.keys(values)) {
      if (values[key] !== null && typeof values[key] === 'object') values[key] = this._onlyInputWithRules(values[key], `${prefix + key}.`)
      else if (values[key] === undefined || !Object.keys(this.rules).includes(prefix + key)) delete values[key]
    }

    return values
  }

  _parsedRulesRecurse(
    attribute: string,
    rulesArray: (any | SimpleObject | string)[],
    parsedRules: SimpleObject,
    wildCardValues: number[] = [],
  ) {
    const parentPath = attribute.substring(0, attribute.indexOf('*') - 1)
    const parentValue = (get(this.input, parentPath, []) ?? []) as SimpleObject[]

    for (let propertyNumber = 0, len = parentValue.length; propertyNumber < len; propertyNumber++) {
      const workingValues = [...wildCardValues, propertyNumber]
      this._parseRulesCheck(
        replace(attribute, '*', String(propertyNumber)),
        rulesArray,
        parsedRules,
        workingValues,
      )
    }
  }

  _parseRules(rules: SimpleObject = {}) {
    const parsedRules: SimpleObject = {}
    rules = flattenObject(rules)
    for (const attribute in rules) {
      const rulesArray = rules[attribute] as (any | SimpleObject | string)[]
      this._parseRulesCheck(attribute, rulesArray, parsedRules)
    }
    return parsedRules
  }

  _parseRulesCheck(
    attribute: string,
    rulesArray: (any | SimpleObject | string)[],
    parsedRules: SimpleObject,
    wildCardValues?: number[],
  ) {
    if (attribute.includes('*')) this._parsedRulesRecurse(attribute, rulesArray, parsedRules, wildCardValues)
    else this._parseRulesDefault(attribute, rulesArray, parsedRules, wildCardValues)
  }

  _parseRulesDefault(
    attribute: string,
    rulesArray: any[] | SimpleObject[] | string,
    parsedRules: any | SimpleObject,
    wildCardValues?: (number | string)[],
  ) {
    const attributeRules = []

    if (Array.isArray(rulesArray)) {
      rulesArray = this._prepareRulesArray(rulesArray)
    }
    else if (rulesArray === undefined || (rulesArray.trim() === '')) {
      rulesArray = []
    }
    else {
      rulesArray = String(rulesArray).split('|').filter(Boolean)
    }

    for (const ruleKey of rulesArray) {
      const rule = this._extractRuleAndRuleValue(ruleKey)
      if (rule.value) rule.value = this._replaceWildCards(rule.value, wildCardValues)
      this._replaceWildCardsMessages(wildCardValues)

      if (Validator.manager.isAsync(rule.name)) this.hasAsync = true
      attributeRules.push(rule)
    }

    parsedRules[attribute] = attributeRules
  }

  _passesOptionalCheck(attribute: string) {
    const findRules = ['sometimes', 'nullable']
    return this._hasRule(attribute, findRules) && !this._suppliedWithData(attribute)
  }

  _prepareRulesArray(rulesArray: any[] | SimpleObject[]) {
    return rulesArray.map(ruleArray => typeof ruleArray === 'object'
      ? Object.entries(ruleArray).map(([name, value]) => ({ name, value }))
      : ruleArray,
    ).flat()
  }

  _replaceWildCards(path: string, nums: (number | string)[] | undefined) {
    if (!nums) return path

    for (const num of nums) {
      const pos = path.indexOf('*')
      if (pos === -1) return path
      path = path.substring(0, pos) + num + path.substring(pos + 1)
    }
    return path
  }

  _replaceWildCardsMessages(nums: (number | string)[] | undefined) {
    const customMessages = this.messages.customMessages
    for (const key of Object.keys(customMessages)) {
      const newKey = this._replaceWildCards(key, nums)
      customMessages[newKey] = customMessages[key]
    }

    this.messages._setCustom(customMessages)
  }

  _shouldStopValidating(attribute: string, rulePassed: any) {
    if (!this.stopOnAttributes || rulePassed) return false
    return Array.isArray(this.stopOnAttributes) ? this.stopOnAttributes.includes(attribute) : true
  }

  _suppliedWithData(attribute: string) {
    const keys = attribute.split('.')
    let obj = this.input

    for (const key of keys) {
      if (!obj || !hasOwnProperty(obj, key)) return false

      obj = obj[key]
    }

    return true
  }

  check() {
    for (let attribute in this.rules) {
      const attributeRules = this.rules[attribute]
      const inputValue = get(this.input ?? {}, attribute)

      if (this._passesOptionalCheck(attribute)) continue

      for (const { name, value } of attributeRules) {
        const rule = this.getRule(name)

        if (!this._isValidatable(rule, inputValue)) continue

        const rulePassed = rule.validate(inputValue, value, attribute)
        if (!rulePassed) {
          if (name === 'confirmed' && this.confirmedReverse) {
            attribute = `${attribute}_confirmation`
            Object.assign(rule, { attribute })
          }
          this._addFailure(rule)
        }

        if (this._shouldStopValidating(attribute, rulePassed)) break
      }
    }

    return !this.errorCount
  }

  checkAsync(passes?: (() => void) | boolean, fails?: any) {
    const emptyFn = () => {
      // empty code block
    }
    passes = passes || emptyFn
    fails = fails || emptyFn
    const failsOne = (rule: Rule, message = '') => {
      return this._addFailure(rule, message)
    }
    const resolvedAll = (allPassed: boolean) => {
      if (allPassed && typeof passes === 'function') passes()
      else fails()
    }
    const asyncResolvers = new AsyncResolvers(failsOne, resolvedAll)
    const validateRule = (
      inputValue: number | SimpleObject | string,
      ruleOptions: SimpleObject,
      rule: Rule,
      attribute = '',
    ) => {
      return () => {
        const resolverIndex = asyncResolvers.add(rule)
        rule.validate(inputValue, ruleOptions.value, attribute, () => asyncResolvers.resolve(resolverIndex))
      }
    }

    for (const attribute in this.rules) {
      const attributeRules = get(this.rules, attribute) as SimpleObject[]
      const inputValue = get(this.input, attribute)
      if (this._passesOptionalCheck(attribute))
        continue

      for (const ruleOptions of attributeRules) {
        const rule = this.getRule(ruleOptions.name)
        if (this._isValidatable(rule, inputValue)) validateRule(inputValue, ruleOptions, rule, attribute)()
      }
    }

    asyncResolvers.enableFiring()
    asyncResolvers.fire()
  }

  fails(fails?: CbFunction) {
    const async = this._checkAsync('fails', fails)
    return async ? this.checkAsync(false, fails) : !this.check()
  }

  getDefaultLang() {
    return Validator.lang
  }

  getRule(name: string): Rule {
    return Validator.manager.make(name, this)
  }

  passes(passes?: () => void) {
    const async = this._checkAsync('passes', passes)
    return async ? this.checkAsync(passes) : this.check()
  }

  setAttributeFormatter(func: any) {
    this.messages._setAttributeFormatter(func)
  }

  setAttributeNames(attributes: SimpleObject = {}) {
    this.messages._setAttributeNames(attributes)
  }

  stopOnError(attributes: boolean | SimpleObject) {
    this.stopOnAttributes = attributes
  }

  validated(passes?: CbFunction, fails?: CbFunction) {
    if (this._checkAsync('passes', passes))
      return this.checkAsync(() => passes?.(this._onlyInputWithRules()), fails)

    if (this.check()) return this._onlyInputWithRules()

    throw new Error('Validation failed!')
  }
}
