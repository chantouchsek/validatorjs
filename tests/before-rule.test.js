import Validator from '../src'

describe('before rule', function() {
  it('should fail when the comparing attribute are smaller', function() {
    const validator = new Validator({
      input: {
        date: '2020-01-01',
        date2: '2020-01-02',
      },
      rules: {
        date2: 'before:date',
      },
    })

    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.errors.first('date2')).toEqual('The date2 must be before date.')
  })

  it('should fail when the comparing attribute are equal', function() {
    const validator = new Validator({
      input: {
        date: '2020-01-01',
        date2: '2020-01-01',
      },
      rules: {
        date2: 'before:date',
      },
    })

    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.errors.first('date2')).toEqual('The date2 must be before date.')
  })

  it('should pass when the comparing attribute are greater', function() {
    const validator = new Validator({
      input: {
        date: '2020-01-03',
        date2: '2020-01-02',
      },
      rules: {
        date2: 'before:date',
      },
    })

    expect(validator.fails()).not.toBeTruthy()
    expect(validator.passes()).toBeTruthy()
  })
})

