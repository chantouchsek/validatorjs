import Massages from './messages'

export default class Lang {
  static messages: Record<string, any> = Object.create({})

  static _set(lang: string, rawMessages: Record<string, any>) {
    this.messages[lang] = rawMessages
  }

  static _get(lang: string): Record<string, string> {
    this._load(lang)
    return this.messages[lang]
  }

  static _setRuleMessage(lang: string, attribute: string, message?: string) {
    this._load(lang)
    const messages: Record<string, any> = Object.create(this.messages)
    if (message === undefined) {
      message = messages[lang].def
    }

    messages[lang][attribute] = message
  }

  static _load(lang: string) {
    if (!this.messages[lang]) {
      let rawMessage
      try {
        rawMessage = require(`./lang/${lang}`)
        this._set(lang, rawMessage.default)
      } catch (e) {
        this._set(lang, {})
      }
    }
  }

  static _make(lang: string) {
    const messages = Object.create(this.messages)
    this._load(lang)
    return new Massages(lang, messages[lang])
  }
}
