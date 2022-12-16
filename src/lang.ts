import type { LangTypes } from './types'
import locales from './locales'
import Massages from './messages'

export default class Lang {
  static messages = {} as Record<LangTypes, Record<string, any>>

  static _set(lang: LangTypes, rawMessages: Record<string, any>) {
    this.messages[lang] = rawMessages
  }

  static _get(lang: LangTypes) {
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
    if (!this.messages[lang]) this._set(lang, locales[lang])
  }

  static _make(lang: LangTypes) {
    const messages = Object.create(this.messages)
    this._load(lang)
    return new Massages(lang, messages[lang])
  }
}
