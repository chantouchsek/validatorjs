import type { Rule } from './rule'
import type { SimpleObject } from './types'
import { has, snakeCase } from 'lodash'
import { flattenObject, toCamelCase } from './utils'

export default class Messages {
  public customMessages: SimpleObject = {}
  private attributeNames: SimpleObject = {}
  private attributeFormatter: ((arg: any) => any) | undefined
  static replacements: any = {}

  constructor(public readonly messages: SimpleObject) {
    this.customMessages = {}
    this.attributeNames = {}
    Messages._setReplacements()
  }

  static _setReplacements() {
    this.replacements = {
      between(template: string, rule: Rule): string {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          min: parameters[0],
          max: parameters[1],
        })
      },
      digits_between(template: string, rule: Rule): string {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          min: parameters[0],
          max: parameters[1],
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
      after(template: string, rule: Rule): string {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          after: this._getAttributeName(parameters[0]),
        })
      },
      before(template: string, rule: Rule): string {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          before: this._getAttributeName(parameters[0]),
        })
      },
      after_or_equal(template: string, rule: Rule): string {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          after_or_equal: this._getAttributeName(parameters[0]),
        })
      },
      before_or_equal(template: string, rule: Rule): string {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          before_or_equal: this._getAttributeName(parameters[0]),
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

  _setCustom(customMessages: SimpleObject = {}) {
    this.customMessages = customMessages
  }

  _setAttributeNames(attributes: SimpleObject) {
    this.attributeNames = attributes
  }

  _setAttributeFormatter(func: any) {
    this.attributeFormatter = func
  }

  _getAttributeName(attribute: string): string {
    let name = attribute
    const attributes = flattenObject(this.messages.attributes)
    const attributeNames = flattenObject(this.attributeNames)
    const camelCase = toCamelCase(attribute)
    const snakecase = snakeCase(attribute)
    if (has(attributeNames, camelCase) || has(attributeNames, snakecase)) {
      return attributeNames[snakecase] || attributeNames[camelCase]
    }
    if (has(attributes, attribute)) {
      name = attributes[attribute]
    } else if (this.attributeFormatter) {
      name = this.attributeFormatter(name)
    }
    while (name.includes('confirmation')) {
      name = name.replace(new RegExp('\\sconfirmation', 'g'), '')
    }
    return name
  }

  render(rule: Rule) {
    if (rule.customMessages) {
      return rule.customMessages
    }
    const template = this._getTemplate(rule)
    let message: string
    if (Messages.replacements[rule.name]) {
      message = Messages.replacements[rule.name].apply(this, [template, rule])
    } else {
      message = this._replacePlaceholders(rule, template, {})
    }
    return message
  }

  _getTemplate(rule: Rule): string {
    const messages = this.messages
    let template = messages.def
    const customMessages = this.customMessages
    const formats = [`${rule.name}.${rule.attribute}`, rule.name]
    for (const format of formats) {
      if (has(customMessages, format)) {
        template = customMessages[format]
        break
      } else if (has(messages, format) && messages[format]) {
        template = messages[format]
        break
      }
    }
    if (typeof template === 'object') {
      template = template[rule._getValueType()]
    }
    return template
  }

  _replacePlaceholders(rule: Rule, template: string | any, data: SimpleObject): string {
    let message = ''
    let attribute
    data.attribute = this._getAttributeName(rule.attribute)
    data[rule.name] = data[rule.name] || rule.getParameters().join(',')
    if (typeof template === 'string' && typeof data === 'object') {
      message = template
      for (attribute in data) {
        message = message.replace(RegExp(`:${attribute}`, 'g'), data[attribute])
      }
    }

    return message
  }
}
