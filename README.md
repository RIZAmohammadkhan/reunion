# Class of 2026 Reunion Countdown

A Vite web app ready for Cloudflare Pages.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

The built app is written to `dist/`.

## Deploy To Cloudflare Pages

Use these settings in Cloudflare Pages:

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`

Or deploy from this machine with Wrangler:

```bash
npm run deploy
```
