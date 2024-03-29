import type { LangTypes, SimpleObject } from './types'
import locales from './lang'
import Massages from './messages'

export default class I18n {
  public static messages = {} as Record<LangTypes, SimpleObject>

  static _get(lang: LangTypes) {
    this._load(lang)
    return this.messages[lang]
  }

  static _load(lang: LangTypes) {
    if (!this.messages[lang])
      this._set(lang, locales[lang])
  }

  static _make(lang: LangTypes, defaultAttributeName?: string) {
    this._load(lang)
    const messages: SimpleObject = Object.create(this.messages)
    return new Massages(messages[lang] ?? {}, defaultAttributeName)
  }

  static _set(lang: LangTypes, rawMessages: SimpleObject) {
    this.messages[lang] = rawMessages
  }

  static _setRuleMessage(lang: LangTypes, attribute: string, message?: string) {
    this._load(lang)
    const messages: SimpleObject = Object.create(this.messages)
    if (message === undefined)
      message = messages[lang].def

    messages[lang][attribute] = message
  }
}
