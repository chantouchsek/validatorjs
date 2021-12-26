import { hasOwnProperty } from '../types/object'
import type { Rule } from './rule'

export default class Messages {
  private lang: string
  private readonly messages: Record<string, any> = {}
  customMessages: Record<string, any> = {}
  private attributeNames: Record<string, any> = {}
  private attributeFormatter: ((arg: any) => any) | undefined
  static replacements: any = {}

  constructor(lang: string, messages: Record<string, any> = {}) {
    this.lang = lang
    this.messages = messages || {}
    this.customMessages = {}
    this.attributeNames = {}
    Messages._setReplacements()
  }

  static _setReplacements() {
    this.replacements = {
      between(template: any, rule: Rule) {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          min: parameters[0],
          max: parameters[1],
        })
      },
      digits_between(template: any, rule: Rule) {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          min: parameters[0],
          max: parameters[1],
        })
      },
      required_if(template: any, rule: Rule) {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          other: this._getAttributeName(parameters[0]),
          value: parameters[1],
        })
      },
      required_unless(template: any, rule: Rule) {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          other: this._getAttributeName(parameters[0]),
          value: parameters[1],
        })
      },
      required_with(template: any, rule: Rule) {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          field: this._getAttributeName(parameters[0]),
        })
      },
      required_with_all(template: any, rule: Rule) {
        const parameters = rule.getParameters()
        const getAttributeName = this._getAttributeName.bind(this)
        return this._replacePlaceholders(rule, template, {
          fields: parameters.map(getAttributeName).join(', '),
        })
      },
      required_without(template: any, rule: Rule) {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          field: this._getAttributeName(parameters[0]),
        })
      },
      required_without_all(template: any, rule: Rule) {
        const parameters = rule.getParameters()
        const getAttributeName = this._getAttributeName.bind(this)
        return this._replacePlaceholders(rule, template, {
          fields: parameters.map(getAttributeName).join(', '),
        })
      },
      after(template: any, rule: Rule) {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          after: this._getAttributeName(parameters[0]),
        })
      },
      before(template: any, rule: Rule) {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          before: this._getAttributeName(parameters[0]),
        })
      },
      after_or_equal(template: any, rule: Rule) {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          after_or_equal: this._getAttributeName(parameters[0]),
        })
      },
      before_or_equal(template: any, rule: Rule) {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          before_or_equal: this._getAttributeName(parameters[0]),
        })
      },
      same(template: any, rule: Rule) {
        const parameters = rule.getParameters()
        return this._replacePlaceholders(rule, template, {
          same: this._getAttributeName(parameters[0]),
        })
      },
    }
  }

  _setCustom(customMessages?: Record<string, any>) {
    this.customMessages = customMessages || {}
  }

  _setAttributeNames(attributes: Record<string, any>[]) {
    this.attributeNames = attributes
  }

  _setAttributeFormatter(func: any) {
    this.attributeFormatter = func
  }

  _getAttributeName(attribute: string) {
    let name = attribute
    if (hasOwnProperty(this.attributeNames, attribute)) {
      return this.attributeNames[attribute]
    } else if (hasOwnProperty(this.messages.attributes, attribute)) {
      name = this.messages.attributes[attribute]
    }
    if (this.attributeFormatter) {
      name = this.attributeFormatter(name)
    }
    return name
  }

  all() {
    return this.messages
  }

  render(rule: Rule): string {
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

  _getTemplate(rule: Rule) {
    const messages = this.messages
    let template = this.messages.def
    const customMessages = this.customMessages
    const formats = [`${rule.name}.${rule.attribute}`, rule.name]
    for (let i = 0, format; i < formats.length; i++) {
      format = formats[i]
      if (hasOwnProperty(customMessages, format)) {
        template = customMessages[format]
        break
      } else if (hasOwnProperty(messages, format)) {
        template = messages[format]
        break
      }

      if (typeof template === 'object') {
        template = template[rule._getValueType()]
      }
    }

    return template
  }

  _replacePlaceholders(
    rule: Rule,
    template: any,
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