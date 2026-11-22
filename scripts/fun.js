#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, rmSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// src/fun/ is a checkout of its own repo (OmskGameJam/win-55-ui-fun): ~35 MB of
// demo assets that .gitignore keeps out of this repo. The working tree stays
// here, so editing src/fun/* is editing the fun repo directly - there is no
// export/copy/pull-back step, only the fun repo itself needs syncing. This
// script is the one place that knows about the split; everything else is plain
// `git` run with src/fun as the working directory.
const projectRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..')
const funDir = join(projectRoot, 'src', 'fun')
const branch = 'master'
const remoteUrl = process.env.FUN_REMOTE ?? 'https://github.com/OmskGameJam/win-55-ui-fun.git'

function usage(exitCode = 0) {
  const output = [
    'Usage:',
    '  npm run fun:pull                  clone src/fun, or fast-forward it',
    '  npm run fun:pop                   delete src/fun (assets stay on the remote)',
    '  npm run fun                       git status of src/fun',
    '  npm run fun -- <git args>         any git command inside src/fun',
    '  npm run fun -- init               adopt loose files in src/fun as the checkout',
    '',
    'Examples:',
    '  npm run fun -- status',
    '  npm run fun -- commit -am "tweak badapple"',
    '  npm run fun -- push',
    '  npm run fun:pop -- --force        discard uncommitted / unpushed work',
  ].join('\n')

  if (exitCode === 0) {
    console.log(output)
  } else {
    console.error(output)
  }

  process.exit(exitCode)
}

function fail(message) {
  console.error(`fun-cli: ${message}`)
  process.exit(1)
}

function git(args, { cwd = funDir, capture = false } = {}) {
  const output = execFileSync('git', args, {
    cwd,
    stdio: capture ? 'pipe' : 'inherit',
    encoding: 'utf8',
  })

  return capture ? output.trim() : ''
}

/** Git command whose failure is an answer, not an error. */
function probeGit(args) {
  try {
    return git(args, { capture: true })
  } catch {
    return null
  }
}

/** Run git, turning a non-zero exit into a one-line hint instead of a stack trace. */
function run(args, hint, options) {
  try {
    git(args, options)
  } catch {
    fail(hint)
  }
}

/** Forward to git in src/fun: keep git's own message, exit non-zero but quietly. */
function passThrough(args) {
  try {
    git(args)
  } catch {
    process.exit(1)
  }
}

/** 'absent' (no src/fun), 'loose' (files but no checkout) or 'repo'. */
function funState() {
  if (!existsSync(funDir)) {
    return 'absent'
  }

  return existsSync(join(funDir, '.git')) ? 'repo' : 'loose'
}

function requireRepo() {
  const state = funState()

  if (state === 'absent') {
    fail('src/fun is not checked out - run "npm run fun:pull"')
  }

  if (state === 'loose') {
    fail('src/fun has files but is not a git checkout - run "npm run fun -- init" to adopt them')
  }
}

function hasUnpushedCommits() {
  const ahead = probeGit(['log', '--branches', '--not', '--remotes', '--oneline'])

  return Boolean(ahead)
}

function pull() {
  const state = funState()

  if (state === 'absent') {
    run(
      ['clone', remoteUrl, funDir],
      `cannot clone ${remoteUrl} - does the repo exist? Set FUN_REMOTE to override`,
      { cwd: projectRoot },
    )
    return
  }

  if (state === 'loose') {
    fail(`src/fun has ${readdirSync(funDir).length} loose entr(ies); adopt them with "npm run fun -- init" or move them aside`)
  }

  const remotes = probeGit(['remote']) ?? ''

  if (!remotes.split('\n').includes('origin')) {
    fail('src/fun has no "origin" remote - add it with "npm run fun -- remote add origin <url>"')
  }

  run(['fetch', '--prune'], `cannot fetch ${remoteUrl} - check the network/remote`)

  const upstream = probeGit(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}'])

  if (!upstream) {
    console.log(`fun-cli: src/fun has no upstream yet - push it with "npm run fun -- push -u origin ${branch}"`)
    return
  }

  if (probeGit(['status', '--porcelain'])) {
    console.log('fun-cli: src/fun has uncommitted changes; a fast-forward may refuse')
  }

  run(['merge', '--ff-only', upstream], `src/fun did not fast-forward to ${upstream} - commit/merge by hand`)
}

function pop(argv) {
  const force = argv.includes('--force')
  const state = funState()

  if (state === 'absent') {
    console.log('fun-cli: src/fun is already gone')
    return
  }

  if (state === 'loose') {
    if (!force) {
      fail(`src/fun holds ${readdirSync(funDir).length} loose entr(ies) that no git checkout owns - use --force to delete them`)
    }
  } else {
    if (!force && probeGit(['status', '--porcelain'])) {
      fail('src/fun has uncommitted changes - commit/`npm run fun -- push` them, or use --force')
    }

    if (!force && hasUnpushedCommits()) {
      fail('src/fun has unpushed commits - `npm run fun -- push` them, or use --force')
    }
  }

  rmSync(funDir, { recursive: true, force: true })
  console.log(`fun-cli: removed src/fun (restore with "npm run fun:pull")`)
}

/** Turn an existing src/fun (files, no checkout) into the fun repo's working tree. */
function init() {
  if (funState() === 'repo') {
    fail('src/fun is already a git checkout')
  }

  run(['init', '-b', branch, funDir], 'could not create the checkout in src/fun', { cwd: projectRoot })
  run(['remote', 'add', 'origin', remoteUrl], 'could not add the "origin" remote')
  probeGit(['fetch', 'origin'])

  const remoteBranch = probeGit(['rev-parse', '--verify', `refs/remotes/origin/${branch}`])

  if (remoteBranch) {
    // Index becomes the remote tree, the worktree is left untouched: whatever
    // differs locally shows up as an ordinary uncommitted change.
    run(['reset', '--mixed', `origin/${branch}`], `could not align src/fun with origin/${branch}`)
    run(['branch', `--set-upstream-to=origin/${branch}`], `could not set the upstream to origin/${branch}`)
    console.log('\nfun-cli: adopted src/fun against the remote, local differences:')
    git(['status', '--short', '--branch'])
    return
  }

  console.log(`fun-cli: remote has no "${branch}" yet, seeding it from the files in src/fun`)
  run(['add', '-A'], 'could not stage src/fun')
  run(['commit', '-m', 'Add fun'], 'could not commit src/fun')
  console.log(`\nfun-cli: now publish it with "npm run fun -- push -u origin ${branch}"`)
}

const [command, ...rest] = process.argv.slice(2)

if (!command || command === 'status') {
  requireRepo()
  passThrough(['status', '--short', '--branch', ...rest])
} else if (command === 'pull') {
  pull()
} else if (command === 'pop') {
  pop(rest)
} else if (command === 'init') {
  init()
} else if (command === 'help' || command === '--help' || command === '-h') {
  usage()
} else {
  requireRepo()
  passThrough([command, ...rest])
}
