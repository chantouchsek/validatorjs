import { describe, expect, it } from 'vitest'
import type { LangTypes, RuleType } from '../src/main'
import { Validator } from '../src/main'
import type { SimpleObject } from '../src/types'

interface Language {
  input: null | SimpleObject
  locale: LangTypes
  message: string
  rules: Record<RuleType, any>
}

describe('locales / messages', () => {
  it('should default to english', () => {
    expect(Validator.getDefaultLang()).toEqual('en')
  })
  it('should throw exception when attempting to get non exist translation', () => {
    const validator = new Validator({ username: 'admin' }, { username: 'required' }, { locale: 'abc' as never })
    expect(validator.passes()).toBeTruthy()
  })
  it('should be able to change locales', () => {
    const oldLang = Validator.getDefaultLang()
    Validator.useLang('ja')
    expect(Validator.getDefaultLang()).toEqual('ja')
    Validator.useLang(oldLang)
  })
  it('should be able to add custom', () => {
    const oldLang = Validator.getDefaultLang()
    const rawMessages = { attributes: {}, required: 'Le nkundla iyadingeka' }
    Validator.setMessages('zu' as never, rawMessages)
    Validator.useLang('zu' as never)
    const validator = new Validator({ zip: '' }, { zip: 'required' })

    const messages = Validator.getMessages('zu' as never)
    expect(messages).toEqual(rawMessages)
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('zip')).toEqual('Le nkundla iyadingeka')
    Validator.useLang(oldLang)
  })
})

describe('should concurrent the language', () => {
  const languages: Language[] = [
    {
      input: null,
      locale: 'ar',
      message: 'الصفة name يجب أن تكون مقبولة',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'az',
      message: 'name qəbul edilməlidir',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'be',
      message: 'Вы павінны прыняць name.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'bg',
      message: 'Трябва да приемете name.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'bs',
      message: 'Polje name mora biti prihvaćeno.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'ca',
      message: 'El camp name pot ser aceptat.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'cs',
      message: 'name musí být přijat.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'cy',
      message: 'Rhaid derbyn name.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'da',
      message: 'name skal accepteres.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'de',
      message: 'Das name Feld muss akzeptiert werden.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'el',
      message: 'Το πεδίο name πρέπει να γίνει αποδεκτό.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'en',
      message: 'The name must be accepted.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'es',
      message: 'El campo name debe ser aceptado.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'et',
      message: 'name tuleb aktsepteerida.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'eu',
      message: 'name onartua izan behar da.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'fa',
      message: 'فیلد name می بایست تایید شود',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'fi',
      message: 'name on oltava hyväksytty.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'fr',
      message: 'Le champ name doit être accepté.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'hr',
      message: 'Polje name mora biti prihvaćeno.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'hu',
      message: 'A(z) name el kell legyen fogadva!',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'id',
      message: 'name harus disetujui.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'it',
      message: 'Il campo name deve essere accettato.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'ja',
      message: 'nameを確認してください。',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'ka',
      message: 'name უნდა იყოს მონიშნული.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'km',
      message: 'ឈ្មោះ ត្រូវតែទទួលយក។',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'ko',
      message: 'name을(를) 동의해야 합니다.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'lt',
      message: 'Laukas name turi būti priimtas.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'lv',
      message: ' name ir jābūt pieņemtam.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'mk',
      message: 'Полето name мора да биде прифатено.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'mn',
      message: 'name баталсан байх шаардлагатай.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'ms',
      message: 'name mesti diterima pakai.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'nb_NO',
      message: 'name må være akseptert.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'nl',
      message: 'Het name veld moet geaccepteerd worden.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'pl',
      message: 'Pole name musi być zaakceptowane.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'pt',
      message: 'O campo name deverá ser aceite.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'pt_BR',
      message: 'O campo name deve ser aceito.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'ro',
      message: 'name trebuie acceptat.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'ru',
      message: 'Вы должны принять name.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'se',
      message: 'name måste vara accepterat.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'sl',
      message: 'name mora biti sprejet.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'sq',
      message: 'name duhet të pranohet.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'sr',
      message: 'Polje name mora biti prihvaćeno.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'sv',
      message: 'name måste accepteras.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'tr',
      message: 'name kabul edilmeli.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'ua',
      message: 'name повиннен бути прийнятий.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'uk',
      message: 'Ви повинні прийняти name.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'uz',
      message: 'Siz name ni qabul qilishingiz kerak.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'vi',
      message: 'name phải được chấp nhận.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'zh',
      message: 'name必须是可接受的.',
      rules: { name: 'accepted' },
    },
    {
      input: null,
      locale: 'zh_TW',
      message: 'name必須接受。',
      rules: { name: 'accepted' },
    },
  ]
  it('should get message of current locale', () => {
    const { input, locale, message, rules } = languages[0]
    const validator = new Validator(input, rules, { locale })
    expect(validator.getDefaultLang()).toEqual(locale)
    expect(validator.passes()).toBeFalsy()
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('name')).toBe(message)
  })
})
