export interface ParsedArgs {
  positional: string[]
  flags: Record<string, string | boolean>
}

/** Manual `--flag value` / `--flag` (boolean) scanner - mirrors scripts/font/src/cli-args.ts (not shared: see CLAUDE.md on why the font/emoji tools can't share code directly, same applies here). */
export function parseArgs(argv: string[]): ParsedArgs {
  const positional: string[] = []
  const flags: Record<string, string | boolean> = {}

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]

    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = argv[i + 1]

      if (next !== undefined && !next.startsWith('--')) {
        flags[key] = next
        i++
      } else {
        flags[key] = true
      }
    } else {
      positional.push(arg)
    }
  }

  return { positional, flags }
}

export function getFlag(flags: ParsedArgs['flags'], key: string): string | undefined {
  const value = flags[key]
  return typeof value === 'string' ? value : undefined
}

export function hasFlag(flags: ParsedArgs['flags'], key: string): boolean {
  return flags[key] !== undefined && flags[key] !== false
}
