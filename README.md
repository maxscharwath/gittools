# GitTools

GitTools is a tool to copy files from one git repository to another.
It is useful for automatically cloning a repository, changing the remote origin, and pushing to a new repository.

## Installation
To have access to the full functionality of GitTools, you must have the following installed:
- [Git](https://git-scm.com/downloads)
- [Github CLI](https://cli.github.com/manual/installation)
- [Node.js](https://nodejs.org/en/download/)

Github CLI is used to create a new repository, and archiving repositories.

## Usage

### Copying a repository
```bash
gittools copy <source> <destination> [options]
```
- `source` is the source repository to copy from
- `destination` is the destination repository to copy to
- `options` are the options to use
    - `-c, --create` creates the destination repository if it does not exist (requires Github CLI)
    - `-a, --archive` archives the source repository after copying (requires Github CLI)

### Archiving repositories (requires Github CLI)
```bash
gittools archive <user/org>
```
- `user/org` is the user or organization to archive all repositories for

The command will ask for confirmation before archiving each repository to prevent accidental archiving.
