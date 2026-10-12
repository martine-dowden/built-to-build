import fs from 'node:fs'
import { type Argument, type Command, Option } from 'commander'

/** Generate readme by concatenating readme-martial.md and iterating over the cli */
export function generateDocs(program: Command) {
  const partial = fs.readFileSync('readme-partial.md', 'utf8')
  let md = partial
  md += `\n\n## ${program.name()}`
  if (program.description()) {
    md += `\n\n ${program.description()}`
  }

  md += '\n\n### Global Options'
  md += generateTable({ options: program.options as Option[], addHelp: true })

  if (program.commands.length) {
    md += '\n\n### Commands'
    program.commands.forEach((cmd) => {
      md += `\n\n#### ▶️ ${cmd.name()}`
      md += `\n\n${cmd.description()}`
      if (cmd.registeredArguments.length) {
        md += '\n\n##### Arguments'
        md += generateTable({ args: cmd.registeredArguments })
      }
      if (cmd.options.length) {
        md += '\n\n##### Options'
        md += generateTable({ options: cmd.options, addHelp: false })
      }
    })
  }

  md += '\n'
  fs.writeFileSync('readme.md', md)
}

function generateTable({
  options = [],
  args = [],
  addHelp = false,
}: {
  options?: readonly Option[]
  args?: readonly Argument[]
  addHelp?: boolean
}): string {
  const list = [...options, ...args]
  let md = ''
  md += `\n\n| ${options.length ? 'Flag' : 'Argument'} | Description | Default | Options | Required |`
  md += '\n|--------|-------------|---------|---------|----------|'
  if (addHelp) {
    md += '\n| -h, --help | Display help for command | | | false |'
  }
  list.forEach((listItem) => {
    md += `\n| ${listItem instanceof Option ? listItem.flags : listItem.name()} | ${listItem.description} | ${listItem.defaultValue ?? ''} | ${listItem.argChoices ?? ''} | ${listItem.required}`
  })
  return md
}
