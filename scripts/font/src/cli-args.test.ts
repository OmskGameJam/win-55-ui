import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseArgs, getFlag, hasFlag } from './cli-args.js'

test('parseArgs separates positionals from --flag value pairs', () => {
  const { positional, flags } = parseArgs(['strike', 'font.ttf', '12', '--out', 'out.bdf', '--charset', 'AB'])
  assert.deepEqual(positional, ['strike', 'font.ttf', '12'])
  assert.equal(flags.out, 'out.bdf')
  assert.equal(flags.charset, 'AB')
})

test('parseArgs treats a trailing --flag with no value as boolean true', () => {
  const { flags } = parseArgs(['register', 'Regular', '12', '--write'])
  assert.equal(flags.write, true)
})

test('parseArgs treats a --flag immediately followed by another --flag as boolean true', () => {
  const { flags } = parseArgs(['--verbose', '--out', 'x.bdf'])
  assert.equal(flags.verbose, true)
  assert.equal(flags.out, 'x.bdf')
})

test('getFlag/hasFlag distinguish string values from boolean presence', () => {
  const { flags } = parseArgs(['--write', '--out', 'x.ttf'])
  assert.equal(getFlag(flags, 'out'), 'x.ttf')
  assert.equal(getFlag(flags, 'write'), undefined)
  assert.equal(hasFlag(flags, 'write'), true)
  assert.equal(hasFlag(flags, 'missing'), false)
})
