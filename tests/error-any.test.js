import Validator from '../src'

describe('Error any', () => {
  it('should return false when validation has not yet run', function() {
    const validator = new Validator({
      input: {
        username: '',
      },
      rules: {
        username: 'required',
      },
    })
    expect(validator.errors.any()).not.toBeTruthy()
  })

  it('should has any error when validator has been run.', function() {
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
    expect(validator.errors.any()).toBeTruthy()
  })

  it('should flush all errors', function() {
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
    validator.errors.flush()
    expect(validator.errors.any()).not.toBeTruthy()
  })

  it('should be able to fill errors object directly', function() {
    const validator = new Validator()
    const errors = {
      'name': [
        'The name field is required'
      ]
    }
    validator.errors.fill(errors)
    expect(validator.errors.has('name')).toBeTruthy()
    expect(validator.errors.first('name')).toEqual('The name field is required')
  })

  it('should be able to clear errors by an attribute', function() {
    const validator = new Validator({
      input: {
        name: ''
      },
      rules: {
        name: 'required'
      }
    })
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.fails()).toBeTruthy()
    validator.errors.clear('name')
    expect(validator.errors.has('name')).not.toBeTruthy()
  })

  it('should clear all errors without pass any attribute to clear()', function() {
    const validator = new Validator({
      input: {
        name: ''
      },
      rules: {
        name: 'required'
      }
    })
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.fails()).toBeTruthy()
    validator.errors.clear()
    expect(validator.errors.any()).not.toBeTruthy()
  })

  it('should clear errors when pass attributes as array to clear()', function() {
    const validator = new Validator({
      input: {
        name: ''
      },
      rules: {
        name: 'required'
      }
    })
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.fails()).toBeTruthy()
    validator.errors.clear(['name'])
    expect(validator.errors.has('name')).not.toBeTruthy()
  })
})
