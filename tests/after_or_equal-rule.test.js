import Validator from '../src'

describe('after or equal rule', () => {
  it('should fail when the comparing attribute are greater', function() {
    const validator = new Validator({
      input: { date1: '2020-01-02', date2: '2020-01-01' },
      rules: { date2: 'after_or_equal:date1' },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.errors.first('date2')).toEqual('The date2 must be equal or after date1.')
  })
  it('should pass when the comparing attributes are equal', function() {
    const validator = new Validator({
      input: { date1: '2020-01-02', date2: '2020-01-02' },
      rules: { date2: 'after_or_equal:date1' },
    })
    expect(validator.fails()).not.toBeTruthy()
    expect(validator.passes()).toBeTruthy()
  })
  it('should pass when the comparing attributes are smaller', function() {
    const validator = new Validator({
      input: { date1: '2020-01-01', date2: '2020-01-02' },
      rules: { date2: 'after_or_equal:date1' },
    })
    expect(validator.fails()).not.toBeTruthy()
    expect(validator.passes()).toBeTruthy()
  })
})
