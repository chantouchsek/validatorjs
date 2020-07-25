import Validator from '../src'

describe('Error counts', function() {
  it('should return 0 when validation has not yet run', function() {
    const validator = new Validator({
      input: {
        username: '',
      },
      rules: {
        username: 'required',
      },
    })
    expect(validator.errorCount).toEqual(0)
  })

  it('should return a count when there are errors', function() {
    const validator = new Validator({
      input: {
        username: '',
        name: '',
      },
      rules: {
        username: 'required',
        name: 'required',
      },
    })
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.errorCount).toEqual(2)
  })

  it('should not return a count when error free', function() {
    const validator = new Validator({
      input: {
        username: 'a',
        name: 'a',
      },
      rules: {
        username: 'required',
        name: 'required',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.errorCount).toEqual(0)
  })
})
