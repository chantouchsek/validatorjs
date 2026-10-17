import { execFileSync } from 'node:child_process'
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'

// Run with development Node; optional arguments select consumer Node executables.
const root = process.cwd()
const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
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

  const missingPeerAssertion = `
const assert = require('assert')
assert.throws(() => require.resolve('libphonenumber-js/max'), { code: 'MODULE_NOT_FOUND' })
assert.throws(() => require('@chantouchsek/validatorjs/phone'), error =>
  error.code === 'MODULE_NOT_FOUND' && /libphonenumber-js/.test(error.message))
`
  writeFileSync(join(directory, 'missing-peer.cjs'), missingPeerAssertion)
  writeFileSync(join(directory, 'missing-peer.mjs'), `
import assert from 'assert'
import('@chantouchsek/validatorjs/phone').then(
  () => { throw new Error('The optional adapter unexpectedly loaded without its peer') },
  error => {
    assert.equal(error.code, 'ERR_MODULE_NOT_FOUND')
    assert.match(error.message, /libphonenumber-js/)
  },
).catch(error => { console.error(error); process.exitCode = 1 })
`)
  for (const runtime of runtimes.length ? runtimes : [process.execPath]) {
    run(runtime, ['missing-peer.cjs'])
    run(runtime, ['missing-peer.mjs'])
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

  run('pnpm', ['add', `libphonenumber-js@${manifest.peerDependencies['libphonenumber-js']}`, '--ignore-scripts'])
  const phoneAssertions = `
assert.equal(new Validator({}).getRule('phone').isMissed(), true)
registerPhoneRule(Validator)
registerPhoneRule(Validator)
assert.equal(new Validator({ contact: '012 345 678' }, { contact: 'phone:KH' }).passes(), true)
assert.equal(new Validator({ contact: '012 345 678' }, { contact: 'phone' }).fails(), true)
assert.equal(new Validator({ contact: '+1 213 373 4253' }, { contact: 'phone:KH' }).fails(), true)
assert.equal(new Validator({ contact: '+1 213 373 4253 ext. 123' }, { contact: 'phone' }).fails(), true)
assert.deepEqual(new Validator({ contact: '  +855 12 345 678  ' }, { contact: 'phone' }).validated(), { contact: '  +855 12 345 678  ' })
`
  writeFileSync(join(directory, 'phone.mjs'), `import assert from 'assert'\nimport { Validator } from '@chantouchsek/validatorjs'\nimport { registerPhoneRule } from '@chantouchsek/validatorjs/phone'\n${phoneAssertions}`)
  writeFileSync(join(directory, 'phone.cjs'), `const assert = require('assert')\nconst { Validator } = require('@chantouchsek/validatorjs')\nconst { registerPhoneRule } = require('@chantouchsek/validatorjs/phone')\n${phoneAssertions}`)
  const phoneTypes = `${types}
import { registerPhoneRule } from '@chantouchsek/validatorjs/phone'
registerPhoneRule(Validator)
// @ts-expect-error Registration requires the public Validator constructor.
registerPhoneRule({})
// @ts-expect-error There is no registration options object.
registerPhoneRule(Validator, { country: 'KH' })
`
  writeFileSync(join(directory, 'phone.mts'), phoneTypes)
  writeFileSync(join(directory, 'phone.cts'), phoneTypes)
  run(process.execPath, [resolve(root, 'node_modules/typescript/bin/tsc'), '--noEmit', '--strict', '--target', 'ES2020', '--module', 'NodeNext', '--moduleResolution', 'NodeNext', 'phone.mts', 'phone.cts'])
  writeFileSync(join(directory, 'phone.ts'), phoneTypes)
  run(process.execPath, [resolve(root, 'node_modules/typescript/bin/tsc'), '--noEmit', '--strict', '--target', 'ES2020', '--module', 'CommonJS', '--moduleResolution', 'Node', 'phone.ts'])

  // Execute the actual README TypeScript blocks and assert their documented results.
  const section = readFileSync(join(root, 'README.md'), 'utf8').split('### Optional Phone Validation\n')[1].split('\n### ')[0]
  const examples = [...section.matchAll(/```ts\n([\s\S]*?)```/g)]
  const exampleFiles = examples.map(([, code], index) => {
    const source = code.split('\n').map((line) => {
      const [expression, expected] = line.split(' // => ')
      return expected === undefined ? line : `expectExample(${expression}, ${expected})`
    }).join('\n')
    const file = `phone-example-${index}.mts`
    writeFileSync(join(directory, file), `
function expectExample(actual: unknown, expected: unknown): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected))
    throw new Error('README example returned an unexpected result: ' + JSON.stringify(actual))
}
${source}`)
    return file
  })
  if (exampleFiles.length !== 4) throw new Error('Expected four executable phone README examples')
  run(process.execPath, [resolve(root, 'node_modules/typescript/bin/tsc'), '--strict', '--target', 'ES2019', '--module', 'NodeNext', '--moduleResolution', 'NodeNext', '--outDir', 'examples', ...exampleFiles])
  for (const runtime of runtimes.length ? runtimes : [process.execPath]) {
    run(runtime, ['phone.mjs'])
    run(runtime, ['phone.cjs'])
    for (const file of exampleFiles) run(runtime, [join('examples', file.replace('.mts', '.mjs'))])
  }
  console.log('Packed core without peer, optional phone adapter, declarations, and four README examples passed.')
}
finally {
  rmSync(directory, { recursive: true, force: true })
}
