# Solution Design: `backup-card`

> Companion to `PRD HA Backup Card.md`. This document covers *how* the card is
> built; the PRD covers *what* and *why*.

## 1. Overview
A single, self-contained custom Lovelace card. No backend, no Python. It renders
inside HA's frontend and communicates with the supervisor via
`home-assistant-js-websocket` (`hass.connection.sendMessagePromise` /
`subscribeMessage`). All logic runs in the browser.

## 2. Architecture & data flow
```
HA frontend (hass)
   │
   ▼
backup-card.ts  ── reads card config (YAML) + hass.user.is_admin
   │
   ├─ websocket.ts  ── callWS: backup/info, list_backups, list_agents,
   │                  generate, remove, restore; subscribe backup events
   │        │
   │        ▼
   │      rag.ts  ── pure computeRag(info, thresholds) → 'green'|'amber'|'red'
   │
   └─ render (Lit templates) ── RAG badge, metrics, inventory grid, modals
```
The card holds a local reactive state object; WS results and events update it;
Lit re-renders.

## 3. Module breakdown
- `src/backup-card.ts` — custom element registration, config parse, lifecycle, orchestration, render.
- `src/types.ts` — `BackupCardConfig`, `BackupInfo`, `BackupEntry`, `RagStatus`, `RagThresholds`.
- `src/websocket.ts` — typed wrappers for `backup/*` websocket calls (`generateBackup`, `deleteBackup`, `restoreBackup`, `fetchAgentsInfo`, `getBackupInfo`).
- `src/rag.ts` — pure `computeRag(info, thresholds)`; unit-tested, no HA dependency.
- `src/confirm-dialog.ts` — reusable two-step confirm modal (Delete/Restore).
- `src/editor.ts` — `LovelaceCardEditor` (`<backup-card-editor>`) for in-UI config.
- `src/translations/en.json` — externalised strings.
- `hacs.json`, `info.md`, `vite.config.ts`, `tsconfig.json` — packaging/build.

## 4. Card state machine
`idle → loading → (ready | error)`; action overlays `creating` / `restoring`
(disabled UI + spinner) → back to `ready`. `error` shows retry. `aria-live`
announces transitions.

## 5. RAG engine
```
computeRag(info, t):
  if last_job_failed or freeGB < t.threshold_free_gb → 'red'
  ageH = hoursSince(lastSuccess)
  if ageH > t.threshold_amber_days*24 → 'red'
  if ageH <= t.threshold_green_hours and remoteOkWhenRequired → 'green'
  else → 'amber'
```
Thresholds default to `{green_hours:48, amber_days:7, free_gb:1}`, overridable
via config (§5.3 of PRD).

## 6. Config schema (YAML) + types
```yaml
type: custom:backup-card
name: My Backups
threshold_green_hours: 48
threshold_amber_days: 7
threshold_free_gb: 1
```
```ts
interface BackupCardConfig {
  name?: string;
  threshold_green_hours?: number;
  threshold_amber_days?: number;
  threshold_free_gb?: number;
}
```

## 7. Security / permissions
Admin-gated actions (Backup Now, Delete, Restore) check `hass.user.is_admin`;
non-admins render read-only (metrics + grid only). The card handles no tokens.
No `console` logging of auth data or full payloads.

## 8. Testing
- Unit: `rag.ts` across seeded threshold/config variants; `websocket.ts` with a
  mocked `hass.connection`.
- Manual QA matrix: HA 2024.7 + latest; admin vs non-admin; empty/list/error
  states; <480px layout.

## 9. Verified websocket API (HA 2024.7+)

Confirmed against HA frontend `src/data/backup.ts`. Commands and key params:

| Command               | Params                                                        | Returns                                                        |
| --------------------- | ------------------------------------------------------------ | ------------------------------------------------------------- |
| `backup/info`         | —                                                            | `backups[]`, `state`, `last_completed_automatic_backup`, `last_attempted_automatic_backup`, `next_automatic_backup`, `agent_errors` |
| `backup/agents/info`  | —                                                            | `{ agents: [{ agent_id, name }] }`                            |
| `backup/generate`     | `agent_ids`, `name`, `password`, `include_homeassistant`, `include_database`, `include_all_addons` | `{ backup_id }`                                       |
| `backup/delete`       | `backup_id`                                                  | void                                                          |
| `backup/restore`      | `backup_id`, `agent_id`, `password?`, restore options       | `{ backup_id }`                                                |

Notes:
- HA's backup id is `backup_id` (the card maps it to `slug`).
- Local agents: `backup.local`, `hassio.local`; remote = other agent IDs (network mounts, `cloud.cloud`).
- `backup/info` carries the full backup list, so one call serves both health and inventory.
- **Free storage is not exposed** by the backup API; the RAG "free <1 GB" input is unpopulated (see PRD §5.1). A storage source (e.g. system health) would be needed to enable it.
- **Live updates:** the card reloads `backup/info` after every management action, and additionally polls it on a `refresh_interval` (default 30s, `0` to disable) while mounted. A HA backup *event subscription* would be preferable if/when its command is confirmed; polling is the robust fallback and is already implemented.

## 10. Requirement Traceability

| REQ-ACT | Requirement        | Design module / function                         | Status                 |
| ------- | ------------------ | ------------------------------------------------ | ---------------------- |
| 01      | Backup Now         | `websocket.generateBackup` + card modal          | done                   |
| 02      | View/Set Schedule  | card schedule display + `navigate` to `/config/backup` | done (read-only + deep-link) |
| 03      | Delete Backup      | `websocket.deleteBackup` + `confirm-dialog`      | done                   |
| 04      | Create on Remote   | `websocket.generateBackup({ agentIds })` + agent selector in Backup Now modal | done (v2)            |
| 05      | Restore Instance   | `websocket.restoreBackup` + `confirm-dialog`     | done                   |
| 06      | Open Location      | `navigate` to `/config/backup`                   | done                   |
| 07      | Config via UI      | `editor.ts` (`<backup-card-editor>`), `getConfigElement`/`getStubConfig` | done (v2)        |
| 08      | Externalised text  | `localize` + `translations/en.json`              | done                   |

Live updates use background polling (`refresh_interval`, default 30s) via
`setInterval` in `backup-card.ts`, not websocket subscription (the
`backup/subscribe`/`backup/event` command was not verified against HA source).

Telemetry (PRD §5.1) is served by `getBackupInfo`, `fetchAgentsInfo`
and the pure `computeRag` engine.
