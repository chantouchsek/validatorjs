import Validator from '../src/main'

describe('lang / messages', () => {
  it('should default to english', () => {
    expect(Validator.getDefaultLang()).toEqual('en')
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
})
