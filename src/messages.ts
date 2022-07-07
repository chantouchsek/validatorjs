import type { Rule } from './rule'
import {
  flattenObject,
  hasOwnProperty,
  toCamelCase,
  toSnakeCase,
} from './utils'

export default class Messages {
  private lang: string
  private readonly messages: Record<string, any> = {}
  customMessages: Record<string, any> = {}
  private attributeNames: Record<string, any> = {}
  private attributeFormatter: ((arg: any) => any) | undefined
  static replacements: any = {}

  constructor(lang: string, messages: Record<string, any>) {
    this.lang = lang
    this.messages = messages
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

  _setCustom(customMessages: Record<string, any> = {}) {
    this.customMessages = customMessages
  }

  _setAttributeNames(attributes: Record<string, any>) {
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
    const snakeCase = toSnakeCase(attribute)
    if (
      hasOwnProperty(attributeNames, camelCase) ||
      hasOwnProperty(attributeNames, snakeCase)
    ) {
      return attributeNames[snakeCase] || attributeNames[camelCase]
    }
    if (hasOwnProperty(attributes, attribute)) {
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
    let template = this.messages.def
    const customMessages = this.customMessages
    const formats = [`${rule.name}.${rule.attribute}`, rule.name]
    for (const format of formats) {
      if (hasOwnProperty(customMessages, format)) {
        template = customMessages[format]
        break
      } else if (hasOwnProperty(messages, format) && messages[format]) {
        template = messages[format]
        break
      }
    }
    if (typeof template === 'object') {
      template = template[rule._getValueType()]
    }
    return template
  }

  _replacePlaceholders(
    rule: Rule,
    template: string | any,
    data: Record<string, any>,
  ): string {
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
