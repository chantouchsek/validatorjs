import { describe, expect, it } from 'vitest'
import { Validator } from '../src/main'
import * as rules from '../src/rules'
import * as utils from '../src/utils'

type Exports = Record<string, unknown>

const ruleModules = import.meta.glob<Exports>('../src/rules/*.ts', { eager: true })
const utilityModules = import.meta.glob<Exports>('../src/utils/*.ts', { eager: true })

function exportsFromModules(modules: Record<string, Exports>) {
  return Object.entries(modules)
    .filter(([path]) => !path.endsWith('/index.ts'))
    .flatMap(([, module]) => Object.entries(module))
}

const ruleExports = exportsFromModules(ruleModules)
const utilityExports = exportsFromModules(utilityModules)

describe('runtime source export registries', () => {
  it('re-exports every rule implementation without extra runtime exports', () => {
    expect(Object.keys(rules).sort()).toEqual(ruleExports.map(([name]) => name).sort())
  })

  it.each(ruleExports)('exposes the %s rule and makes it available to validators', (name, implementation) => {
    expect(typeof implementation).toBe('function')
    expect((rules as Exports)[name]).toBe(implementation)
    expect(new Validator({}).getRule(name).isMissed()).toBe(false)
  })

  it('re-exports every utility implementation without extra runtime exports', () => {
    expect(Object.keys(utils).sort()).toEqual(utilityExports.map(([name]) => name).sort())
    for (const [name, implementation] of utilityExports) {
      expect(typeof implementation).toBe('function')
      expect((utils as Exports)[name]).toBe(implementation)
    }
  })
})
