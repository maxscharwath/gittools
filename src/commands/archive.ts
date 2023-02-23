import { execFile, execFileSync } from 'child_process'
import inquirer from 'inquirer'

export async function archive(user: string) {
  const data = JSON.parse(execFileSync('gh', ['repo', 'list', user, '--visibility=public', '--no-archived', '--json', 'url']).toString());
  for (const { url } of data) {
    const { archive } = await inquirer.prompt({
      name: 'archive',
      type: 'confirm',
      message: `Do you want to archive ${url}?`,
    });
    if (archive) {
      execFile('gh', ['repo', 'archive', url, '--confirm'])
    }
  }
}
