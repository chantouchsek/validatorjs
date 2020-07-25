import Validator from '../src'

describe('require validation pass rules', function() {
  it('should pass with non-empty strings', function() {
    const validator = new Validator({
      input: {
        name: 'David',
      },
      rules: {
        name: 'required',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail with empty strings', function() {
    const validator = new Validator({
      input: {
        email: '',
      },
      rules: {
        email: 'required',
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail with strings containing only white space', function() {
    const validator = new Validator({
      input: {
        name: '      	',
      },
      rules: {
        name: 'required',
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail when a value is equal to undefined', function() {
    const validator = new Validator({
      input: {
        name: undefined,
      },
      rules: {
        name: 'required',
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail when a value is equal to null', function() {
    const validator = new Validator({
      input: {
        name: null,
      },
      rules: {
        name: 'required',
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass when a value is numeric', function() {
    const validator = new Validator({
      input: {
        age: 29,
      },
      rules: {
        age: 'required',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail when the attribute is not passed in', function() {
    const validator = new Validator({
      input: {},
      rules: {
        email: 'required',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
  })

  it('should fail when the array is empty', function() {
    const validator = new Validator({
      input: {
        users: [],
      },
      rules: {
        users: 'required|array',
      },
    })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).not.toBeTruthy()
  })

  it('should not fail when not an empty array', function() {
    const validator = new Validator({
      input: {
        users: [false],
      },
      rules: {
        users: 'required|array',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })
})
