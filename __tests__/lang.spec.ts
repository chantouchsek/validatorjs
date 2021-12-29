import Validator from '../src/main'

describe('lang / messages', () => {
  it('should default to english', () => {
    expect(Validator.getDefaultLang()).toEqual('en')
  })
  it('should throw exception when attempting to get non exist translation', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    Validator.registerAsync('username', function () {})
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
  it('should get lang of ar', () => {
    const validator = new Validator(
      undefined,
      { name: 'required' },
      { locale: 'ar' },
    )
    expect(validator.getDefaultLang()).toEqual('ar')
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('name')).toBe('حقل الصفة name مطلوب.')
  })
  it('should get lang of az', () => {
    const validator = new Validator(
      undefined,
      { name: 'required' },
      { locale: 'az' },
    )
    expect(validator.getDefaultLang()).toEqual('az')
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('name')).toBe(' name mütləqdir')
  })
  it('should get lang of be', () => {
    const validator = new Validator(
      undefined,
      { name: 'required' },
      { locale: 'be' },
    )
    expect(validator.getDefaultLang()).toEqual('be')
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('name')).toBe(
      'Поле name абавязкова для запаўнення.',
    )
  })
  it('should get lang of bg', () => {
    const validator = new Validator(
      undefined,
      { name: 'required' },
      { locale: 'bg' },
    )
    expect(validator.getDefaultLang()).toEqual('bg')
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('name')).toBe('Полето name е задължително.')
  })
  it('should get lang of bs', () => {
    const validator = new Validator(
      undefined,
      { name: 'accepted' },
      { locale: 'bs' },
    )
    expect(validator.getDefaultLang()).toEqual('bs')
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('name')).toBe(
      'Polje name mora biti prihvaćeno.',
    )
  })
  it('should get lang of ca', () => {
    const validator = new Validator(
      undefined,
      { name: 'accepted' },
      { locale: 'ca' },
    )
    expect(validator.getDefaultLang()).toEqual('ca')
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('name')).toBe('El camp name pot ser aceptat.')
  })
})
