import { execFileSync } from 'node:child_process'
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'

// Run with development Node; optional arguments select consumer Node executables.
const root = process.cwd()
const directory = mkdtempSync(join(tmpdir(), 'validatorjs-consumer-'))
function run(command: string, args: string[], cwd = directory) {
  execFileSync(command, args, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, HUSKY: '0', PATH: `${dirname(process.execPath)}:${process.env.PATH}` },
  })
}

try {
  run('pnpm', ['pack', '--pack-destination', directory], root)
  const archive = readdirSync(directory).find(file => file.endsWith('.tgz'))!
  writeFileSync(join(directory, 'package.json'), JSON.stringify({ private: true, type: 'module', packageManager: 'pnpm@10.26.0' }))
  run('pnpm', ['add', join(directory, archive), '--ignore-scripts'])

  const assertions = `
const input = { user: { name: 'Ada' }, items: [{ sku: 'A1' }], extra: true }
const rules = { 'user.name': 'required', 'items.*.sku': 'required' }
const valid = new Validator(input, rules)
assert.equal(valid.passes(), true)
assert.deepEqual(valid.validated(), { user: { name: 'Ada' }, items: [{ sku: 'A1' }] })
const invalid = new Validator({}, { name: 'required' })
assert.equal(invalid.fails(), true)
assert.equal(invalid.errors.first('name'), 'The name field is required.')
assert.ok(invalid.errors instanceof Errors)
Validator.registerAsync('package_check', (value, _requirement, _attribute, done) => {
  setTimeout(() => done(value === 'ok'), 0)
})
async function checkAsync() {
  assert.equal(await new Validator({ name: 'ok' }, { name: 'package_check' }).passesAsync(), true)
  assert.equal(await new Validator({ name: 'bad' }, { name: 'package_check' }).passesAsync(), false)
}
checkAsync().catch(error => { console.error(error); process.exitCode = 1 })
`
  writeFileSync(join(directory, 'consumer.mjs'), `import assert from 'assert'\nimport { Validator, Errors } from '@chantouchsek/validatorjs'\n${assertions}`)
  writeFileSync(join(directory, 'consumer.cjs'), `const assert = require('assert')\nconst { Validator, Errors } = require('@chantouchsek/validatorjs')\n${assertions}`)

  const runtimes = process.argv.slice(2)
  for (const runtime of runtimes.length ? runtimes : [process.execPath]) {
    run(runtime, ['--version'])
    run(runtime, ['consumer.mjs'])
    run(runtime, ['consumer.cjs'])
  }

  const types = `import { Errors, Validator } from '@chantouchsek/validatorjs'
import type { ValidatorOptions } from '@chantouchsek/validatorjs'
const options: ValidatorOptions = { locale: 'en' }
const validator = new Validator({ name: 'Ada' }, { name: 'required' }, options)
const passed: Promise<boolean> = validator.passesAsync()
const errors: Errors = validator.errors
const message: string | false = errors.first('name')
void [passed, message, validator.validated()]
// @ts-expect-error Unsupported locale must remain a type error.
const invalid: ValidatorOptions = { locale: 'unsupported' }
void invalid
`
  writeFileSync(join(directory, 'consumer.mts'), types)
  writeFileSync(join(directory, 'consumer.cts'), types)
  run(process.execPath, [resolve(root, 'node_modules/typescript/bin/tsc'), '--noEmit', '--strict', '--target', 'ES2020', '--module', 'NodeNext', '--moduleResolution', 'NodeNext', 'consumer.mts', 'consumer.cts'])
  console.log('Packed ESM/CommonJS behavior and declarations passed.')
}
finally {
  rmSync(directory, { recursive: true, force: true })
}
