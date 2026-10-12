# Build to Build

Demo CLI (Forge) for [Martine's](martine.dev) talk _Built to Build_.

## Dev

```shell
  # setup
  pnpm install
  pnpm run build

  # listen to changes and rebuild on save
  pnpm run dev

  # run a command off the CLI
  pnpm run forge <command>
  # run a command off the CLI -- emulated DB
  pnpm run forge:local <command>

  # generate CLI docs
  pnpm run docs

  # lint (biome: https://biomejs.dev/)
  pnpm run lint

  # test (vitest: https://vitest.dev/)
  pnpm run test
  # test & watch
  pnpm run test:watch
```

### Firebase Setup

Only needed for the `save-cat-fact` command.

1. Download the service-account from firebase console > General > Service Accounts > Generate new private key
2. Rename the file to `service-account.json`
3. Place the file at the root of the project
4. In `src/services/firebase-admin.ts` update the TODO with your project ID


## Forge

 Demo CLI for Built to Build talk

### Global Options

| Flag | Description | Default | Options | Required |
|--------|-------------|---------|---------|----------|
| -h, --help | Display help for command | | | false |
| -v, --version | Current Version |  |  | false
| --ci | Indicates the script is being used within automation | false |  | false
| -c, --commit | Unless set, will perform as dry-run |  |  | false
| -e, --env <env> | Environment | local | local,prod | true

### Commands

#### ▶️ cat-fact

returns a random cat fact

#### ▶️ docs

auto generate docs

#### ▶️ hello

My first script

##### Arguments

| Argument | Description | Default | Options | Required |
|--------|-------------|---------|---------|----------|
| fact | A random fact to display after the hello world |  |  | false

#### ▶️ save-cat-fact

Save cat fact to firebase collection

##### Arguments

| Argument | Description | Default | Options | Required |
|--------|-------------|---------|---------|----------|
| fact | Cat fact |  |  | false

#### ▶️ test-colors

Prints out every util log types

#### ▶️ test-spinner

Demo spinner on a 3 second timeout

#### ▶️ who-are-you

Hello ____

##### Options

| Flag | Description | Default | Options | Required |
|--------|-------------|---------|---------|----------|
| --firstName [firstName] | Your first name |  |  | false
| --lastName [lastName] | Your last name |  |  | false
