import { describe, expect, it } from 'vitest'
import { Validator } from '../src/main'

describe('iP Validation rules', () => {
  describe('iPv4 Validation rule', () => {
    it('should pass localhost ipv4 addres', () => {
      const validator = new Validator(
        {
          ipAddr: '127.0.0.1',
        },
        {
          ipAddr: 'ipv4',
        },
      )
      expect(validator.passes()).toBeTruthy()
    })

    it('should pass maximum ip range ', () => {
      const validator = new Validator(
        {
          ipAddr: '255.255.255.255',
        },
        {
          ipAddr: 'ipv4',
        },
      )
      expect(validator.passes()).toBeTruthy()
    })

    it('should pass random ip address withing range ', () => {
      const validator = new Validator(
        {
          ipAddr: '192.168.33.10',
        },
        {
          ipAddr: 'ipv4',
        },
      )
      expect(validator.passes()).toBeTruthy()
    })

    it('should fail ip address containing non integer octants', () => {
      const validator = new Validator(
        {
          ipAddr: '192.fail.33.10',
        },
        {
          ipAddr: 'ipv4',
        },
      )
      expect(validator.passes()).toBeFalsy()
    })

    it('should fail ip address more than 4 octants', () => {
      const validator = new Validator(
        {
          ipAddr: '192.168.33.10.10',
        },
        {
          ipAddr: 'ipv4',
        },
      )
      expect(validator.passes()).toBeFalsy()
    })

    it('should fail ip address less than 4 octants', () => {
      const validator = new Validator(
        {
          ipAddr: '192.168.10',
        },
        {
          ipAddr: 'ipv4',
        },
      )
      expect(validator.passes()).toBeFalsy()
    })

    it('should fail ip address which contains octant values more than 255', () => {
      const validator = new Validator(
        {
          ipAddr: '256.168.10.0',
        },
        {
          ipAddr: 'ipv4',
        },
      )
      expect(validator.passes()).toBeFalsy()
    })

    it('should fail ip address which contains empty octants', () => {
      const validator = new Validator(
        {
          ipAddr: '256...0',
        },
        {
          ipAddr: 'ipv4',
        },
      )
      expect(validator.passes()).toBeFalsy()
    })

    it('should fail on non string input', () => {
      const validator = new Validator(
        {
          ipAddr: 1234,
        },
        {
          ipAddr: 'ipv4',
        },
      )
      expect(validator.passes()).toBeFalsy()
    })
  })

  describe('iPv6 Validation rule', () => {
    it('should pass normal ipv6 address ', () => {
      const validator = new Validator(
        {
          ipAddr: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
        },
        {
          ipAddr: 'ipv6',
        },
      )
      expect(validator.passes()).toBeTruthy()
    })
    it('should fail normal ipv6 address over range', () => {
      const validator = new Validator(
        {
          ipAddr: '2001:0db8:85g3:0000:0000:8a2e:0370:7334',
        },
        {
          ipAddr: 'ipv6',
        },
      )
      expect(validator.fails()).toBeTruthy()
    })

    it('should pass normal ipv6 address with ommited zeros', () => {
      const validator = new Validator(
        {
          ipAddr: '2001:0db8:85a3:0:0:8a2e:0370:7334',
        },
        {
          ipAddr: 'ipv6',
        },
      )
      expect(validator.passes()).toBeTruthy()
    })

    it('should pass max ipv6 address', () => {
      const validator = new Validator(
        {
          ipAddr: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
        },
        {
          ipAddr: 'ipv6',
        },
      )
      expect(validator.passes()).toBeTruthy()
    })

    it('should pass ipv6 address with ommiting section of zeros', () => {
      const validator = new Validator(
        {
          ipAddr: '2001:db8::ff00:42:8329',
        },
        {
          ipAddr: 'ipv6',
        },
      )
      expect(validator.passes()).toBeTruthy()
    })

    it('should pass ipv6 address of localhost', () => {
      const validator = new Validator(
        {
          ipAddr: '::1',
        },
        {
          ipAddr: 'ipv6',
        },
      )
      expect(validator.passes()).toBeTruthy()
    })

    it('should pass ipv6 input with 7 hextets and ending omitting sector', () => {
      const validator = new Validator(
        {
          ipAddr: '1:2:3:4:5:6:7::',
        },
        {
          ipAddr: 'ipv6',
        },
      )
      expect(validator.passes()).toBeTruthy()
    })

    it('should pass ipv6 input with 7 hextets and leading omitting sector', () => {
      const validator = new Validator(
        {
          ipAddr: '::2:3:4:5:6:7:8',
        },
        {
          ipAddr: 'ipv6',
        },
      )
      expect(validator.passes()).toBeTruthy()
    })

    it('should fail on ipv4 address', () => {
      const validator = new Validator(
        {
          ipAddr: '192.168.33.10',
        },
        {
          ipAddr: 'ipv6',
        },
      )
      expect(validator.passes()).toBeFalsy()
    })

    it('should fail on ipv6 address with more than 8 sectors', () => {
      const validator = new Validator(
        {
          ipAddr: '2001:0db8:85a3:1234:5349:8a2e:0370:7334:1234',
        },
        {
          ipAddr: 'ipv6',
        },
      )
      expect(validator.passes()).toBeFalsy()
    })

    it('should fail on ipv6 address with less than 2 sectors', () => {
      const validator = new Validator(
        {
          ipAddr: ':2000',
        },
        {
          ipAddr: 'ipv6',
        },
      )
      expect(validator.passes()).toBeFalsy()
    })

    it('should fail on ipv6 address with bigger values in octet than ffff', () => {
      const validator = new Validator(
        {
          ipAddr: '2001:0db8:85a3:1234:123456789:8a2e:0370:7334',
        },
        {
          ipAddr: 'ipv6',
        },
      )
      expect(validator.passes()).toBeFalsy()
    })

    it('should fail on ipv6 address when consecutive ommiting sections occure', () => {
      const validator = new Validator(
        {
          ipAddr: '234::123::23',
        },
        {
          ipAddr: 'ipv6',
        },
      )
      expect(validator.passes()).toBeFalsy()
    })

    it('should fail on non string input', () => {
      const validator = new Validator(
        {
          ipAddr: 1234,
        },
        {
          ipAddr: 'ipv6',
        },
      )
      expect(validator.passes()).toBeFalsy()
    })

    it('should fail on ipv6 input with less then 8 hextets and no omitting sector', () => {
      const validator = new Validator(
        {
          ipAddr: '2001:0db8:85a3:9876:1234:8a2e',
        },
        {
          ipAddr: 'ipv6',
        },
      )
      expect(validator.passes()).toBeFalsy()
    })

    it('should fail ipv6 input with 8 hextets and one omitting sector', () => {
      const validator = new Validator(
        {
          ipAddr: '1:2:3:4:5::6:7:8',
        },
        {
          ipAddr: 'ipv6',
        },
      )
      expect(validator.passes()).toBeFalsy()
    })

    it('should fail ipv6 starting with one colon', () => {
      const validator = new Validator(
        {
          ipAddr: ':1:2:3:4:5:6:7',
        },
        {
          ipAddr: 'ipv6',
        },
      )
      expect(validator.passes()).toBeFalsy()
    })
  })

  describe('iP General Validation rule', () => {
    it('should pass localhost ipv4 addres', () => {
      const validator = new Validator(
        {
          ipAddr: '127.0.0.1',
        },
        {
          ipAddr: 'ip',
        },
      )
      expect(validator.passes()).toBeTruthy()
    })

    it('should pass minimum ipv4 addres', () => {
      const validator = new Validator(
        {
          ipAddr: '0.0.0.0',
        },
        {
          ipAddr: 'ip',
        },
      )
      expect(validator.passes()).toBeTruthy()
    })

    it('should pass localhost ipv6 addres', () => {
      const validator = new Validator(
        {
          ipAddr: '::1',
        },
        {
          ipAddr: 'ip',
        },
      )
      expect(validator.passes()).toBeTruthy()
    })

    it('should pass normal ipv6 addres', () => {
      const validator = new Validator(
        {
          ipAddr: '2001:0db8:85a3:0:0:8a2e:0370:7334',
        },
        {
          ipAddr: 'ip',
        },
      )
      expect(validator.passes()).toBeTruthy()
    })

    it('should fail on random string ipv4 type', () => {
      const validator = new Validator(
        {
          ipAddr: 'F.A.I.L',
        },
        {
          ipAddr: 'ip',
        },
      )
      expect(validator.passes()).toBeFalsy()
    })

    it('should fail on random string ipv6 type', () => {
      const validator = new Validator(
        {
          ipAddr: 'F:A:I:L:U:R:E:!:',
        },
        {
          ipAddr: 'ip',
        },
      )
      expect(validator.passes()).toBeFalsy()
    })
  })
})
