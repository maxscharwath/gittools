import crypto from 'crypto'
import path from 'path'
import os from 'os'
import fs from 'fs'
import { simpleGit } from 'simple-git';
import ora, { Ora } from 'ora'
import inquirer from 'inquirer';
import util from 'util'
import { execFile } from 'child_process'



async function cleanup(spinner: Ora, tempDir: string) {
  spinner.start(`Cleaning up ${tempDir}`);
  if (fs.existsSync(tempDir)) {
    try {
      await fs.promises.rm(tempDir, { recursive: true, maxRetries: 10 });
    } catch (e) {
      spinner.fail(`An error occurred while cleaning up ${tempDir}, please remove it manually`);
      return;
    }
  }
  spinner.succeed(`Cleaned up ${tempDir}`);
}

export async function copy(from: string, to: string, options: { create: boolean, archive: boolean }){
  const uuid = crypto.randomUUID();
  const tempDir = path.resolve(os.tmpdir(), uuid);

  const spinner = ora({
    stream: process.stdout,
  });

  process.on('exit', async () => {
    spinner.info('Forcefully exiting');
    await cleanup(spinner, tempDir);
    process.exit(1);
  });

  spinner.stopAndPersist(
    {
      symbol: '🚀',
      text: `Gitcopy ${from} to ${to}`,
    }
  )

  try {
    spinner.start(`Creating temp directory ${tempDir}`);
    await fs.promises.mkdir(tempDir, { recursive: true });
    spinner.succeed(`Created temp directory ${tempDir}`);

    const git = simpleGit(tempDir);
    spinner.start(`Cloning ${from} to ${tempDir}`);
    await git.clone(from, tempDir);
    spinner.succeed(`Cloned ${from} to ${tempDir}`);
    spinner.start(`Adding remote ${to}`);
    await git.addRemote("to", to);
    spinner.succeed(`Added remote ${to}`);

    do{
      try {
        spinner.start(`Checking if repository ${to} exists`);
        await git.listRemote(["--exit-code", "to"]);
        spinner.succeed(`Repository ${to} exists`);
        break;
      } catch (e) {
        spinner.fail(`The repository ${to} does not exist`);

        if (options.create) {
          spinner.start(`Creating repository ${to}`);
          try {
            await util.promisify(execFile)('gh', ['repo', 'create', to, '--public']);
            spinner.succeed(`Created repository ${to}`);
            break;
          } catch (e) {
            spinner.fail(`An error occurred while creating ${to}`);
          }
        }
      }
    }while(await inquirer.prompt({
      type: 'press-to-continue',
      anyKey: true,
      pressToContinueMessage: 'Press any key to check again',
    }))


    spinner.start(`Pushing to ${to}`);
    await git.push("to");
    spinner.succeed(`Pushed to ${to}`);

    if (options.archive) {
      spinner.start(`Archiving ${to}`);
      await util.promisify(execFile)('gh', ['repo', 'archive', to, '--confirm']);
      spinner.succeed(`Archived ${to}`);
    }
  } catch (e) {
    spinner.fail(`An error occurred while copying ${from} to ${to}`);
  }
  await cleanup(spinner, tempDir);
  spinner.stopAndPersist({
    symbol: '🎉',
    text: `Successfully copied ${from} to ${to}`,
  });
}
