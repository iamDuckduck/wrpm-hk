# WRPM HK

WRPM HK is a pnpm monorepo containing the Astro website and Sanity Studio.

## Workspace commands

Run these commands from the repository root:

```bash
pnpm install
```

Start the Astro website at `http://localhost:4321`:

```bash
pnpm run dev:web
```

Start Sanity Studio at `http://localhost:3333`:

```bash
pnpm run dev:studio
```

To run both applications together, open two terminals and run one development command in each. Press `Ctrl+C` in each terminal to stop the corresponding process.

Build the applications independently:

```bash
pnpm run build:web
pnpm run build:studio
```

Build both applications sequentially:

```bash
pnpm run build
```

