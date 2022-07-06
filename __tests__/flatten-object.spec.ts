import { flattenObject, isEmpty } from '../src/utils'

describe('Object', () => {
  it('should correctly flatten nested object', () => {
    const asserts = [
      [undefined, {}],
      [null, {}],
      [{}, {}],
      [{ foo: null }, { foo: null }],
      [{ foo: {} }, { foo: {} }],
      [{ foo: 1 }, { foo: 1 }],
      [{ foo: [] }, { foo: [] }],
      [{ foo: { bar: 1 } }, { 'foo.bar': 1 }],
      [{ foo: { bar: [] } }, { 'foo.bar': [] }],
      [{ foo: { bar: { fizz: 'buzz' } } }, { 'foo.bar.fizz': 'buzz' }],
      [{ foo: { bar: { fizz: ['buzz'] } } }, { 'foo.bar.fizz': ['buzz'] }],
    ]

    asserts.forEach(function (assert) {
      expect(flattenObject(assert[0])).toEqual(assert[1])
    })
  })
  it('isObject test', () => {
    expect(isEmpty(0)).toBeFalsy()
    expect(isEmpty('0')).toBeFalsy()
    expect(isEmpty([])).toBeTruthy()
    expect(isEmpty({})).toBeTruthy()
    expect(isEmpty(false)).toBeFalsy()
    expect(isEmpty(null)).toBeTruthy()
    expect(isEmpty(undefined)).toBeTruthy()
  })
}) // Page constructor
