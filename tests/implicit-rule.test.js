import Validator from '../src'

describe('implicit rule tests', function() {
  let validator
  beforeEach(() => {
    validator = new Validator()
  })

  it('should fail implicit rule even when undefined', function() {
    validator.registerImplicit('null_or_number', function(val) {
      return (val && val.match(/^\d*$/)) || val === null
    }, ':attribute must be a number or empty')

    validator.setOptions({
      input: {/* empty */ },
      rules: { value: 'null_or_number' },
    })
    expect(validator.passes()).not.toBeTruthy()
  })

  it('should pass implicit rule even when null', function() {
    validator.registerImplicit('null_or_number', function(val) {
      return (val && val.match(/^\d*$/)) || val === null
    }, ':attribute must be a number or empty')

    validator.setOptions({
      input: { value: null },
      rules: { value: 'null_or_number' },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail async implicit rule even when undefined', function(done) {
    validator.registerAsyncImplicit('async_null',
      function(value, attribute, req, passes) {
        setTimeout(function() {
          if (value === null) {
            passes(true)
          } else {
            passes(false)
          }
        }, 50)
      }, ':attribute already taken')

    validator.setOptions({
      input: { /* empty */ },
      rules: { value: 'async_null' },
    })
    validator.fails(done)
  })

  it('should pass async implicit rule even when null', function(done) {
    validator.registerAsyncImplicit('async_null',
      function(value, attribute, req, passes) {
        setTimeout(function() {
          if (value === null) {
            passes(true)
          } else {
            passes(false)
          }
        }, 50)
      }, ':attribute already taken')

    validator.setOptions({
      input: { value: null },
      rules: { value: 'async_null' },
    })
    validator.passes(done)
  })
})
