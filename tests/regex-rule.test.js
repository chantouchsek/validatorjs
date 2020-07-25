import Validator from '../src'

describe('regex validation rule for most common regular expressions', function() {
  it('should pass with the currency pattern: 12,500.00', function() {
    const validator = new Validator({
      input: {
        currency: '12,500.00',
      },
      rules: {
        currency: 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/',
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail with the currency pattern: 200.0', function() {
    const validator = new Validator({
      input: {
        currency: '200.0',
      },
      rules: {
        currency: 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/',
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass with the date pattern: 03/11/2015', function() {
    const validator = new Validator({
      input: {
        pattern: '03/11/2015',
      },
      rules: {
        pattern: ['regex:/^([1-9]|0[1-9]|[12][0-9]|3[01])\\D([1-9]|0[1-9]|1[012])\\D(19[0-9][0-9]|20[0-9][0-9])$/'],
      },
    })
    expect(validator.passes()).toBeTruthy()
  })
  it('should fail with the date pattern: 0311/2015', function() {
    const validator = new Validator({
      input: {
        pattern: '0311/2015',
      },
      rules: {
        pattern: ['regex:/^([1-9]|0[1-9]|[12][0-9]|3[01])\\D([1-9]|0[1-9]|1[012])\\D(19[0-9][0-9]|20[0-9][0-9])$/'],
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass with the year pattern: 2015', function() {
    const validator = new Validator({
      input: {
        pattern: '2015',
      },
      rules: {
        pattern: ['regex:/^(19|20)[\\d]{2,2}$/'],
      },
    })
    expect(validator.passes()).toBeTruthy()
  })
  it('should fail with the year pattern:: 20151', function() {
    const validator = new Validator({
      input: {
        pattern: '20151',
      },
      rules: {
        pattern: ['regex:/^(19|20)[\\d]{2,2}$/'],
      },
    })
    expect(validator.fails()).toBeTruthy()
  })


  it('should pass with the email pattern: johndoe@gmail.com', function() {
    const validator = new Validator({
      input: {
        pattern: 'johndoe@gmail.com',
      },
      rules: {
        pattern: ['regex:/^(([^<>()[\\]\\\.,;:\\s@\\"]+(\\.[^<>()[\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/'],
      },
    })
    expect(validator.passes()).toBeTruthy()
  })
  it('should fail with the email pattern: johndoe.gmail.com', function() {
    const validator = new Validator({
      input: {
        pattern: 'johndoe.gmail.com',
      },
      rules: {
        pattern: ['regex:/^(([^<>()[\\]\\\.,;:\\s@\\"]+(\\.[^<>()[\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/'],
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass with the url pattern: http://github.com', function() {
    const validator = new Validator({
      input: {
        pattern: 'http://github.com',
      },
      rules: {
        pattern: ['regex:/^https?:\\/\\/\\S+/'],
      },
    })
    expect(validator.passes()).toBeTruthy()
  })
  it('should fail with the url pattern: http://githubcom', function() {
    const validator = new Validator({
      input: {
        pattern: 'http:/github.com',
      },
      rules: {
        pattern: ['regex:/^https?:\\/\\/\\S+/'],
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass with the hex pattern: #ff0033', function() {
    const validator = new Validator({
      input: {
        pattern: '#ff0033',
      },
      rules: {
        pattern: ['regex:/^#?([a-f0-9]{6}|[a-f0-9]{3})$/'],
      },
    })
    expect(validator.passes()).toBeTruthy()
  })
  it('should fail with the hex pattern: #xx9911', function() {
    const validator = new Validator({
      input: {
        pattern: '#xx9911',
      },
      rules: {
        pattern: ['regex:/^#?([a-f0-9]{6}|[a-f0-9]{3})$/'],
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass with the slug pattern: matching-a-slug-here', function() {
    const validator = new Validator({
      input: {
        pattern: 'matching-a-slug-here',
      },
      rules: {
        pattern: ['regex:/^[a-z0-9-]+$/'],
      },
    })
    expect(validator.passes()).toBeTruthy()
  })
  it('should fail with the slug pattern: not_matching_here', function() {
    const validator = new Validator({
      input: {
        pattern: 'not_matching_here',
      },
      rules: {
        pattern: ['regex:/^[a-z0-9-]+$/'],
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should support the case insensitive flag', function() {
    const validator = new Validator({
      input: {
        pattern: 'A',
      },
      rules: {
        pattern: ['regex:/[a-f]/i'],
      },
    })

    expect(validator.passes()).toBeTruthy()
  })

  it('should not be case insensitive unless specified', function() {
    const validator = new Validator({
      input: {
        pattern: 'A',
      },
      rules: {
        pattern: ['regex:/[a-f]/'],
      },
    })

    expect(validator.fails()).toBeTruthy()
  })

  it('should pass with the string: 12-500.00A', function() {
    const validator = new Validator({
      input: {
        pattern: '12-500.00A',
      },
      rules: {
        pattern: ['regex:/^[A-Za-z0-9_\\-\\.]+$/'],
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail with the string: 12-500.00/A', function() {
    const validator = new Validator({
      input: {
        pattern: '12-500.00/A',
      },
      rules: {
        pattern: ['regex:/^[A-Za-z0-9_\\-\\.]+$/'],
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass with the string: 12.500', function() {
    const validator = new Validator({
      input: {
        pattern: '12.500',
      },
      rules: {
        pattern: ['regex:/^[A-Za-z0-9_\\-\\.]+$/i'],
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail with the string: 12.500,00', function() {
    const validator = new Validator({
      input: {
        pattern: '12.500,00',
      },
      rules: {
        pattern: ['regex:/^[A-Za-z0-9_\\-\\.]+$/i'],
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass with the number: 12.500', function() {
    const validator = new Validator({
      input: {
        pattern: 12.500,
      },
      rules: {
        pattern: ['regex:/^[A-Za-z0-9_\\-\\.]+$/i'],
      },
    })
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail with the number: -12.500', function() {
    const validator = new Validator({
      input: {
        pattern: -12.500,
      },
      rules: {
        pattern: ['regex:/^[A-Za-z0-9_\\.]+$/i'],
      },
    })
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass with the number: 999', function() {
    const validator = new Validator({
      input: {
        pattern: 999,
      },
      rules: {
        pattern: ['regex:/^[A-Za-z0-9_\\-\\.]+$/i'],
      },
    })
    expect(validator.passes()).toBeTruthy()
  })
})
