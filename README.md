## Usage

```bash
pnpm install
```

## Available Scripts

### `pnpm dev`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `pnpm build`

Builds for production to `dist/`. Also creates `dist/out -> ../out` symlink so the LAZ data files are served correctly.

## Data files

Point cloud LAZ files live in `out/regions/` — not in git. Copy them from the server before building.

## Deployment

Serve the `dist/` folder as static files. Nginx example: `root /path/to/thermal/dist;`
