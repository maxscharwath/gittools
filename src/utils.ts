import { execFileSync } from 'child_process'
import boxen from 'boxen'
import gradient  from 'gradient-string'
import packageJson from '../package.json' assert { type: "json" };

const name = gradient.instagram(packageJson.shortname.toUpperCase());

export function checkIfGhInstalled() {
  try {
    execFileSync('gh', ['--version']);
  } catch (e) {
    console.warn(
      boxen(`${name} requires gh to be installed, please install it from https://cli.github.com/`, {
        padding: 1,
        borderColor: 'yellow',
      })
    )
  }
}

export function printTitle() {
  console.log(boxen(packageJson.description, {
    title: `${name} v${packageJson.version}`,
    titleAlignment: 'center',
    padding: 1,
    margin: 1,
    borderColor: 'blue',
  }));
}
