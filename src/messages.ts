import { get, snakeCase } from 'lodash-es'
import type { Rule } from './rule'
import type { CbFunction, SimpleObject } from './types'
import { flattenObject, toCamelCase } from './utils'

export default class Messages {
  static replacements: SimpleObject = {}
  private attributeFormatter: CbFunction | undefined
  private attributeNames: SimpleObject = {}
  public customMessages: SimpleObject = {}

  constructor(public readonly messages: SimpleObject, public defaultAttributeName?: string) {
    Messages._setReplacements()
  }

  _getAttributeName(attribute: string): string {
    let name = attribute
    const attributes = flattenObject(this.messages.attributes)
    const attributeNames = flattenObject(this.attributeNames)
    const camelCase = toCamelCase(attribute)
    const _snakeCase = snakeCase(attribute)
    if (_snakeCase in attributeNames || camelCase in attributeNames)
      return attributeNames[_snakeCase] ?? attributeNames[camelCase]

    if (attribute in attributes) name = get(attributes, attribute)
    else if (this.attributeFormatter) name = this.attributeFormatter(name)

    while (name.includes('confirmation')) name = name.replace(/\sconfirmation/g, '')

    return name
  }

  _getTemplate(rule: Rule): string {
    const messages = this.messages
    let template = messages.def
    const customMessages = this.customMessages
    const formats = [`${rule.name}.${rule.attribute}`, rule.name]
    for (const format of formats) {
      if (format in customMessages) {
        template = customMessages[format]
        break
      }
      else if (format in messages && messages[format]) {
        template = messages[format]
        break
      }
    }
    if (typeof template === 'object') template = template[rule._getValueType()]

    return template
  }

  _replacePlaceholders(rule: Rule, template: string, data: SimpleObject) {
    const updatedData = Object.assign(data, {
      attribute: this._getAttributeName(rule.attribute),
      [rule.name]: data[rule.name] || rule.getParameters().join(','),
    })
    let placeholder = String(template).trim()
    if (this.defaultAttributeName !== undefined)
      placeholder = template.replace(/(:attribute)/g, this.defaultAttributeName).replace(/\s+/g, ' ')

    return placeholder.replace(/:(\w+)/g, (_, key) => updatedData[key])
  }

  _setAttributeFormatter(func: any) {
    this.attributeFormatter = func
  }

  _setAttributeNames(attributes: SimpleObject) {
    this.attributeNames = attributes
  }

  _setCustom(customMessages: SimpleObject = {}) {
    this.customMessages = customMessages
  }

  static _setReplacements() {
    this.replacements = {
      after(template: string, rule: Rule): string {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          after: this._getAttributeName(parameters[0]),
        })
      },
      after_or_equal(template: string, rule: Rule): string {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          after_or_equal: this._getAttributeName(parameters[0]),
        })
      },
      before(template: string, rule: Rule): string {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          before: this._getAttributeName(parameters[0]),
        })
      },
      before_or_equal(template: string, rule: Rule): string {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          before_or_equal: this._getAttributeName(parameters[0]),
        })
      },
      between(template: string, rule: Rule): string {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          max: parameters[1],
          min: parameters[0],
        })
      },
      digits_between(template: string, rule: Rule): string {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          max: parameters[1],
          min: parameters[0],
        })
      },
      required_if(template: string, rule: Rule): string {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          other: this._getAttributeName(parameters[0]),
          value: parameters[1],
        })
      },
      required_unless(template: string, rule: Rule): string {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          other: this._getAttributeName(parameters[0]),
          value: parameters[1],
        })
      },
      required_with(template: string, rule: Rule): string {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          field: this._getAttributeName(parameters[0]),
        })
      },
      required_with_all(template: string, rule: Rule): string {
        const parameters = rule.getParameters()
        const getAttributeName = this._getAttributeName.bind(this)
        return this._replacePlaceholders(rule, template, {
          fields: parameters.map(getAttributeName).join(', '),
        })
      },
      required_without(template: string, rule: Rule): string {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          field: this._getAttributeName(parameters[0]),
        })
      },
      required_without_all(template: string, rule: Rule): string {
        const parameters = rule.getParameters()
        const getAttributeName = this._getAttributeName.bind(this)
        return this._replacePlaceholders(rule, template, {
          fields: parameters.map(getAttributeName).join(', '),
        })
      },
      same(template: string, rule: Rule): string {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          same: this._getAttributeName(parameters[0]),
        })
      },
    }
  }

  render(rule: Rule) {
    if (rule.customMessages) return rule.customMessages

    const template = this._getTemplate(rule)
    let message: string
    if (Messages.replacements[rule.name]) message = Messages.replacements[rule.name].apply(this, [template, rule])
    else message = this._replacePlaceholders(rule, template, {})

    return message
  }
}
