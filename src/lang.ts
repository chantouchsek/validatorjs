import Massages from './messages'
import { LangTypes } from './types/lang'

export default class Lang {
  static messages: Record<LangTypes, any> = {}

  static _set(lang: LangTypes, rawMessages: Record<string, any>) {
    this.messages[lang] = rawMessages
  }

  static _get(lang: LangTypes): Record<string, string> {
    this._load(lang)
    return this.messages[lang]
  }

  static _setRuleMessage(lang: LangTypes, attribute: string, message?: string) {
    this._load(lang)
    const messages: Record<string, any> = Object.create(this.messages)
    if (message === undefined) {
      message = messages[lang].def
    }

    messages[lang][attribute] = message
  }

  static _load(lang: LangTypes) {
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

  static _make(lang: LangTypes) {
    const messages = Object.create(this.messages)
    this._load(lang)
    return new Massages(lang, messages[lang])
  }
}
