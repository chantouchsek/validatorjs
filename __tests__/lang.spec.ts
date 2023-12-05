import { describe, expect, it } from 'vitest'
import type { LangTypes, RuleType } from '../src/main'
import { Validator } from '../src/main'
import type { SimpleObject } from '../src/types'

interface Language {
  input: SimpleObject | null
  rules: Record<RuleType, any>
  locale: LangTypes
  message: string
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
    const rawMessages = { required: 'Le nkundla iyadingeka', attributes: {} }
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
      rules: { name: 'accepted' },
      locale: 'ar',
      message: 'الصفة name يجب أن تكون مقبولة',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'az',
      message: 'name qəbul edilməlidir',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'be',
      message: 'Вы павінны прыняць name.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'bg',
      message: 'Трябва да приемете name.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'bs',
      message: 'Polje name mora biti prihvaćeno.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'ca',
      message: 'El camp name pot ser aceptat.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'cs',
      message: 'name musí být přijat.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'cy',
      message: 'Rhaid derbyn name.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'da',
      message: 'name skal accepteres.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'de',
      message: 'Das name Feld muss akzeptiert werden.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'el',
      message: 'Το πεδίο name πρέπει να γίνει αποδεκτό.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'en',
      message: 'The name must be accepted.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'es',
      message: 'El campo name debe ser aceptado.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'et',
      message: 'name tuleb aktsepteerida.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'eu',
      message: 'name onartua izan behar da.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'fa',
      message: 'فیلد name می بایست تایید شود',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'fi',
      message: 'name on oltava hyväksytty.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'fr',
      message: 'Le champ name doit être accepté.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'hr',
      message: 'Polje name mora biti prihvaćeno.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'hu',
      message: 'A(z) name el kell legyen fogadva!',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'id',
      message: 'name harus disetujui.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'it',
      message: 'Il campo name deve essere accettato.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'ja',
      message: 'nameを確認してください。',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'ka',
      message: 'name უნდა იყოს მონიშნული.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'km',
      message: 'ឈ្មោះ ត្រូវតែទទួលយក។',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'ko',
      message: 'name을(를) 동의해야 합니다.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'lt',
      message: 'Laukas name turi būti priimtas.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'lv',
      message: ' name ir jābūt pieņemtam.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'mk',
      message: 'Полето name мора да биде прифатено.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'mn',
      message: 'name баталсан байх шаардлагатай.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'ms',
      message: 'name mesti diterima pakai.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'nb_NO',
      message: 'name må være akseptert.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'nl',
      message: 'Het name veld moet geaccepteerd worden.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'pl',
      message: 'Pole name musi być zaakceptowane.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'pt',
      message: 'O campo name deverá ser aceite.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'pt_BR',
      message: 'O campo name deve ser aceito.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'ro',
      message: 'name trebuie acceptat.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'ru',
      message: 'Вы должны принять name.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'se',
      message: 'name måste vara accepterat.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'sl',
      message: 'name mora biti sprejet.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'sq',
      message: 'name duhet të pranohet.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'sr',
      message: 'Polje name mora biti prihvaćeno.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'sv',
      message: 'name måste accepteras.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'tr',
      message: 'name kabul edilmeli.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'ua',
      message: 'name повиннен бути прийнятий.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'uk',
      message: 'Ви повинні прийняти name.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'uz',
      message: 'Siz name ni qabul qilishingiz kerak.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'vi',
      message: 'name phải được chấp nhận.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'zh',
      message: 'name必须是可接受的.',
    },
    {
      input: null,
      rules: { name: 'accepted' },
      locale: 'zh_TW',
      message: 'name必須接受。',
    },
  ]
  it('should get message of current locale', () => {
    const { input, rules, locale, message } = languages[0]
    const validator = new Validator(input, rules, { locale })
    expect(validator.getDefaultLang()).toEqual(locale)
    expect(validator.passes()).toBeFalsy()
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('name')).toBe(message)
  })
})
