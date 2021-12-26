import { replacements } from './attributes'
import { hasOwnProperty } from '../types/object'

export default class Messages {
  private lang: string
  private readonly messages: Record<string, any> = {}
  customMessages: Record<string, any> = {}
  private attributeNames: Record<string, any> = {}
  private attributeFormatter: ((arg: any) => any) | undefined

  constructor(lang: string, messages: Record<string, any> = {}) {
    this.lang = lang
    this.messages = messages || {}
    this.customMessages = {}
    this.attributeNames = {}
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

  render(rule: Record<string, any>) {
    if (rule.customMessages) {
      return rule.customMessages
    }
    const template = this._getTemplate(rule)
    let message
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (replacements[rule.name]) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      message = replacements[rule.name].apply(this, [template, rule])
    } else {
      message = this._replacePlaceholder(rule, template, {})
    }
    return message
  }

  _getTemplate(rule: any) {
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

  _replacePlaceholder(rule: any, template: any, data: Record<string, any>) {
    let message
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
