# AGENTS.md — HA Backup Card

Custom Home Assistant **Lovelace card** (Lit + TypeScript + Vite), not a server or web app.
HACS entry is `dist/backup-card.js` (see `hacs.json` `filename`). Min HA **2024.7+**.

## Commands
- `npm run typecheck | lint | test | build | dev | format`
  - `dev` = `vite build --watch` (a watch-build, **not** a dev server).
  - `format` runs prettier on `src`.
- Single test file: `npx vitest run src/rag.test.ts`. Only `rag` + `websocket` are unit-tested; there are no browser tests.
- Pre-commit hook runs `typecheck → lint → test` (no build) and aborts on first failure.
- CI (`ci.yml`) runs all four incl. `build` on push to `main`/`feature/*` and on PRs.

## Deployment (read before touching `dist/`)
- `dist/` is **gitignored but force-committed to `main` on purpose** — never `git clean` it or "fix" the ignore.
- The running card loads from **jsDelivr**, not the GitHub release:
  `https://cdn.jsdelivr.net/gh/PeteOlds/HA-BackupDashboard@main/dist/backup-card.js`
  Reason: GitHub release assets are served as `application/octet-stream`, which browsers reject for ES-module `import`. jsDelivr serves `application/javascript`, so `@main/dist` is the source of truth for the live card (the `v*` release tag is only for HACS installs).
- `vite.config.ts` sets `base: "./"` so the entry's relative chunk imports resolve under jsDelivr.
- After any card change:
  1. bump `version` in `package.json` (semver; release workflow fires on `v*` tags),
  2. `npm run build`,
  3. `git add -f dist && git commit && git push origin main`,
  4. purge jsDelivr so HA fetches the new build:
     `curl -s -X POST https://purge.jsdelivr.net/ -H 'Content-Type: application/json' -d '{"path":["/gh/PeteOlds/HA-BackupDashboard@main/dist/backup-card.js"]}'`
- `main` is the **deployment branch**; pushing `main` ships the card (this is the exception to "never push main").

## Gotchas
- `home-assistant-js-websocket` v9 does **not** export `HomeAssistant`. Use the local minimal type in `src/types.ts`; do not import it from the lib.
- The free-storage RAG branch is **intentionally dormant**: HA's `backup/info` does not expose free space, so `threshold_free_gb` has no effect yet. Don't add a `free_space` lookup expecting it to exist.
- `rg` is not installed in this environment — use the Grep tool, not the ripgrep CLI.

## HA backup API (verified in `src/websocket.ts`)
- `backup/info`, `backup/agents/info`
- `backup/generate` params: `agent_ids`, `name`, `password`, `include_homeassistant`, `include_database`, `include_all_addons`
- `backup/delete`: `{ backup_id }`; `backup/restore`: `{ backup_id, agent_id }`
- Local agent ids: `backup.local`, `hassio.local`.

## Live instance
- HA at `http://192.168.1.252:8123`. Card is a Lovelace **module** resource pointing at the jsDelivr URL above, on the default "Home" dashboard ("Backups" view).
- Edit the dashboard via the websocket API (`lovelace/config/get` + `lovelace/config/save`); REST `/api/lovelace/*` returns 404 on this instance.
