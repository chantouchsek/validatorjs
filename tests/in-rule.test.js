import Validator from '../src'

describe('in validation rule', function() {
  it('should fail when the value is not in the set of comma separated values', function() {
    const validator = new Validator({
      input: {
        state: 'fakeState',
      },
      rules: {
        state: 'in:CA,TX,FL',
      },
    })
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('state')).toEqual('The selected state is invalid.')
  })

  it('should pass when the value is in the set of comma separated values', function() {
    const validator = new Validator({
      input: {
        state: 'CA',
      },
      rules: {
        state: 'in:CA,TX,FL',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should pass when the value is undefined', function() {
    const validator = new Validator({
      input: {},
      rules: {
        state: 'in:CA,TX,FL',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should pass when the value is an empty string', function() {
    const validator = new Validator({
      input: {
        state: '',
      },
      rules: {
        state: 'in:CA,TX,FL',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should fail when the numeric value is not in the set of comma separated values', function() {
    const validator = new Validator({
      input: {
        quantity: 10,
      },
      rules: {
        quantity: 'in:0,1,2',
      },
    })
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('quantity')).toEqual('The selected quantity is invalid.')
  })

  it('should pass when the value is in the set of comma separated values', function() {
    const validator = new Validator({
      input: {
        quantity: 1,
      },
      rules: {
        quantity: 'in:0,1,2',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should pass when all values are present', function() {
    const validator = new Validator({
      input: {
        fruits: ['apple', 'strawberry'],
      },
      rules: {
        fruits: 'array|in:apple,strawberry,kiwi',
      },
    })

    expect(validator.passes()).toBeTruthy()
  })

  it('should fail when not all values are present', function() {
    const validator = new Validator({
      input: {
        fruits: ['strawberry', 'kiwi'],
      },
      rules: {
        fruits: 'array|in:apple,strawberry',
      },
    })

    expect(validator.passes()).not.toBeTruthy()
  })
})
