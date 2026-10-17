import type { CountryCode } from 'libphonenumber-js/max'
import type { Validator } from './main'
import { isSupportedCountry, parsePhoneNumberFromString } from 'libphonenumber-js/max'

/** Register opt-in phone validation on the application's Validator constructor. */
export function registerPhoneRule(validator: typeof Validator): void {
  validator.register('phone', (value: unknown, requirement: unknown) => {
    if (typeof value !== 'string') return false
    if (requirement !== undefined && (
      typeof requirement !== 'string'
      || !/^[A-Z]{2}$/.test(requirement)
      || !isSupportedCountry(requirement)
    )) {
      return false
    }

    const country = requirement as CountryCode | undefined
    const input = value.trim()
    if ((!country && !input.startsWith('+')) || /^tel:/i.test(input)) return false

    const number = parsePhoneNumberFromString(input, { defaultCountry: country, extract: false })
    return !!number && number.ext === undefined && number.isValid() && (!country || number.country === country)
  }, validator.getMessages(validator.getDefaultLang()).phone)
}
