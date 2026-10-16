import type { LangTypes } from '../src/main'
import { describe, expect, it } from 'vitest'
import { Validator } from '../src/main'

type Dictionary = Record<string, unknown>

const modules = import.meta.glob<{ default: Dictionary }>('../src/lang/*.ts', { eager: true })
const catalogs = Object.entries(modules)
  .filter(([path]) => !path.endsWith('/index.ts'))
  .map(([path, module]) => [path.split('/').pop()!.slice(0, -3) as LangTypes, module.default] as const)

function expectMessageTree(tree: Dictionary) {
  expect(Object.getPrototypeOf(tree)).toBe(Object.prototype)
  for (const value of Object.values(tree)) {
    if (typeof value === 'string') {
      expect(value.trim().length).toBeGreaterThan(0)
    }
    else {
      expect(value).not.toBeNull()
      expect(Array.isArray(value)).toBe(false)
      expect(typeof value).toBe('object')
      expectMessageTree(value as Dictionary)
    }
  }
}

describe('bundled locale catalogs', () => {
  it('exports every locale source through the registry', () => {
    const registry = modules['../src/lang/index.ts'].default
    expect(Object.keys(registry).sort()).toEqual(catalogs.map(([locale]) => locale).sort())
    for (const [locale, messages] of catalogs) {
      expect(registry[locale]).toBe(messages)
    }
  })

  it.each(catalogs)('%s exports message templates and renders independent validation errors', (locale, messages) => {
    const previousLocale = Validator.getDefaultLang()
    try {
      expectMessageTree(messages)
      expect(typeof messages.required).toBe('string')
      expect(typeof messages.attributes).toBe('object')
      expect(Validator.getMessages(locale)).toBe(messages)
      const invalid = new Validator({ field: '' }, { field: 'required' }, {
        locale,
        customAttributes: { field: 'FIELD' },
      })
      expect(invalid.fails()).toBe(true)
      const expected = (messages.required as string).trim().replace(/:attribute/g, 'FIELD')
      expect(invalid.errors.first('field')).toBe(expected)
      expect(invalid.errorCount).toBe(1)
      const valid = new Validator({ field: 'value' }, { field: 'required' }, { locale })
      expect(valid.passes()).toBe(true)
      expect(valid.errors.all()).toEqual({})
      expect(invalid.errors.first('field')).toBe(expected)
    }
    finally {
      Validator.useLang(previousLocale)
    }
  })
})
