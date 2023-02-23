#!/usr/bin/env node

import {program} from 'commander';
import inquirer from 'inquirer';
import PressToContinuePrompt from 'inquirer-press-to-continue';
import updateNotifier from 'update-notifier';
import packageJson from '../package.json' assert { type: "json" };
import { checkIfGhInstalled, printTitle } from './utils.js'
import { copy } from './commands/copy.js';
import { archive } from './commands/archive.js'


updateNotifier({pkg: packageJson}).notify();

inquirer.registerPrompt('press-to-continue', PressToContinuePrompt);

program
  .version(packageJson.version)
  .description(packageJson.description)

program
  .command('copy')
  .description('Copy repository from one to another')
  .argument('<from>', 'from repository')
  .argument('<to>', 'to repository')
  .option('-c, --create', 'create repository if it does not exist')
  .option('-a, --archive', 'archive repository after copying')
  .action(copy)

program
  .command('archive')
  .description('Archive all repositories of a user')
  .argument('<user>', 'user to archive')
  .action(archive)



checkIfGhInstalled();
printTitle();

program.parse();
