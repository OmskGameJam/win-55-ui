import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)))

execSync('npm run build:lib', { stdio: 'inherit' })
execSync('git add -A', { stdio: 'inherit' })
execSync(`git commit -m "Publish ${version}"`, { stdio: 'inherit' })
