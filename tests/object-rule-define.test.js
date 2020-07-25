import Validator from '../src'

describe('object rule define', function() {
  it('mixed rule definition', function() {
    const validator = new Validator({
      input: {
        age: 30,
        name: 'Joe',
      },
      rules: {
        name: [{ required_if: ['age', 30], min: 2 }, 'max:3'],
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('type checking', function() {
    const validator = new Validator({
      input: {
        age: 30,
      },
      rules: {
        age: [{ 'in': [30, 31], not_in: [29, 40] }],
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })
})
