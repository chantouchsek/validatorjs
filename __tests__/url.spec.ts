import Validator from '../src/main'

describe('url validation rule', () => {
  it('should fail with a url only containing http://', () => {
    const link = 'http://'
    const validator = new Validator({ link }, { link: 'url' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
  })

  it('should fail with a url starting with http:// followed by 1 or more characters without a `.`', () => {
    const link = 'google'
    const validator = new Validator({ link }, { link: 'url' })
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass with an https url', () => {
    const link = 'https://google.com'
    const validator = new Validator({ link }, { link: 'url' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass for url with short domain name', () => {
    const link = 'https://t.co'
    const validator = new Validator({ link }, { link: 'url' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with an empty value', () => {
    const validator = new Validator({ link: '' }, { link: 'url' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with an undefined value', () => {
    const validator = new Validator({}, { link: 'url' })
    expect(validator.passes()).toBeTruthy()
  })
})
