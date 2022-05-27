import Validator from '../src/main'

describe('lang / messages', () => {
  const languages = [
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'ar',
      message: 'الصفة name يجب أن تكون مقبولة',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'az',
      message: 'name qəbul edilməlidir',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'be',
      message: 'Вы павінны прыняць name.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'bg',
      message: 'Трябва да приемете name.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'bs',
      message: 'Polje name mora biti prihvaćeno.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'ca',
      message: 'El camp name pot ser aceptat.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'cs',
      message: 'name musí být přijat.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'cy',
      message: 'Rhaid derbyn name.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'da',
      message: 'name skal accepteres.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'de',
      message: 'Das name Feld muss akzeptiert werden.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'el',
      message: 'Το πεδίο name πρέπει να γίνει αποδεκτό.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'en',
      message: 'The name must be accepted.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'es',
      message: 'El campo name debe ser aceptado.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'et',
      message: 'name tuleb aktsepteerida.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'eu',
      message: 'name onartua izan behar da.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'fa',
      message: 'فیلد name می بایست تایید شود',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'fi',
      message: 'name on oltava hyväksytty.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'fr',
      message: 'Le champ name doit être accepté.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'hr',
      message: 'Polje name mora biti prihvaćeno.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'hu',
      message: 'A(z) name el kell legyen fogadva!',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'id',
      message: 'name harus disetujui.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'it',
      message: 'Il campo name deve essere accettato.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'ja',
      message: 'nameを確認してください。',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'ka',
      message: 'name უნდა იყოს მონიშნული.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'kh',
      message: 'ឈ្មោះ ត្រូវតែទទួលយក។',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'ko',
      message: 'name을(를) 동의해야 합니다.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'lt',
      message: 'Laukas name turi būti priimtas.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'lv',
      message: ' name ir jābūt pieņemtam.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'mk',
      message: 'Полето name мора да биде прифатено.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'mn',
      message: 'name баталсан байх шаардлагатай.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'ms',
      message: 'name mesti diterima pakai.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'nb_NO',
      message: 'name må være akseptert.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'nl',
      message: 'Het name veld moet geaccepteerd worden.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'pl',
      message: 'Pole name musi być zaakceptowane.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'pt',
      message: 'O campo name deverá ser aceite.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'pt_BR',
      message: 'O campo name deve ser aceito.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'ro',
      message: 'name trebuie acceptat.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'ru',
      message: 'Вы должны принять name.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'se',
      message: 'name måste vara accepterat.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'sl',
      message: 'name mora biti sprejet.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'sq',
      message: 'name duhet të pranohet.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'sr',
      message: 'Polje name mora biti prihvaćeno.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'sv',
      message: 'name måste accepteras.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'tr',
      message: 'name kabul edilmeli.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'ua',
      message: 'name повиннен бути прийнятий.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'uk',
      message: 'Ви повинні прийняти name.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'uz',
      message: 'Siz name ni qabul qilishingiz kerak.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'vi',
      message: 'name phải được chấp nhận.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'zh',
      message: 'name必须是可接受的.',
    },
    {
      input: undefined,
      rules: { name: 'accepted' },
      locale: 'zh_TW',
      message: 'name必須接受。',
    },
  ]
  it('should default to english', () => {
    expect(Validator.getDefaultLang()).toEqual('en')
  })
  it('should throw exception when attempting to get non exist translation', () => {
    const validator = new Validator(
      { username: 'admin' },
      { username: 'required' },
      { locale: 'abc' },
    )
    expect(validator.passes()).toBeTruthy()
  })
  it('should be able to change lang', () => {
    const oldLang = Validator.getDefaultLang()
    Validator.useLang('ja')
    expect(Validator.getDefaultLang()).toEqual('ja')
    Validator.useLang(oldLang)
  })
  it('should be able to add custom', () => {
    const oldLang = Validator.getDefaultLang()
    const rawMessages = { required: 'Le nkundla iyadingeka', attributes: {} }
    Validator.setMessages('zu', rawMessages)
    Validator.useLang('zu')
    const validator = new Validator({ zip: '' }, { zip: 'required' })

    const messages = Validator.getMessages('zu')
    expect(messages).toEqual(rawMessages)
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('zip')).toEqual('Le nkundla iyadingeka')
    Validator.useLang(oldLang)
  })
  it('should get message of current locale', () => {
    for (const language of languages) {
      const { input, rules, locale, message } = language
      const validator = new Validator(input, rules, { locale })
      expect(validator.getDefaultLang()).toEqual(locale)
      expect(validator.passes()).toBeFalsy()
      expect(validator.fails()).toBeTruthy()
      expect(validator.errors.first('name')).toBe(message)
    }
  })
})
