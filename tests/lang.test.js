import Validator from '../src'

describe('lang / messages', function() {
  let validator
  beforeEach(() => {
    validator = new Validator()
  })

  it('should default to english', function() {
    expect(validator.getDefaultLang()).toEqual('en')
  })

  it('should be able to change lang', function() {
    const oldLang = validator.getDefaultLang()
    validator.useLang('km')
    expect(validator.getDefaultLang()).toEqual('km')
    validator.useLang(oldLang)
  })

  it('should be able to add custom', function() {
    const oldLang = validator.getLang()
    const rawMessages = {
      required: 'Le nkundla iyadingeka',
      attributes: {},
    }
    validator.setMessages('zh', rawMessages).useLang('zh')
    validator.setOptions({
      input: {
        zip: '',
      },
      rules: {
        zip: 'required',
      },
      locale: 'zh',
    })

    const messages = validator.getMessages('zh')
    expect(messages).toEqual(rawMessages)
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('zip')).toEqual('Le nkundla iyadingeka')
    validator.setLang(oldLang)
  })
})
