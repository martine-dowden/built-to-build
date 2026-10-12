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
