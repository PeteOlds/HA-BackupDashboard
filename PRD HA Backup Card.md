**Feature Title:** Dashboard Backup Status & Management Card (`backup-card`)
**Target Platform:** Home Assistant Frontend (Lovelace) — custom HACS-distributed card
**Target Persona:** System Administrators, Smart Home Enthusiasts, Power Users
**Document Status:** Revised (implementation-ready)
**Minimum Supported HA Version:** 2024.7+ (backup agents / locations model)
**Last Updated:** 2026-08-24

## 1. Executive Summary

Home Assistant users currently lack a unified, visually rich Lovelace card to monitor overall backup health, inspect backup inventories (both local and network-attached/remote stores), and execute common management tasks directly from a main dashboard view.

This PRD outlines the requirements for a **custom HACS-distributed Lovelace frontend card** (the *Backup Management Card*) that bridges system telemetry with administrative backup operations, eliminating the need to navigate deep into `Settings > System > Backups` for routine status checks and manual snapshot triggers. The card is a self-contained web component (Lit + TypeScript) that talks to Home Assistant over its websocket API; it is **not** a native core card and does **not** require a home-assistant/frontend contribution.

## 2. Core Concepts & Terminology

- **Backup Store / Agent:** A designated storage target where backup archives (`.tar`) reside, represented in HA 2024.7+ as a *backup agent* or *location*. Classified into `Local` (internal storage/SD/SSD) and `Remote` (network storage, SMB/NFS, or cloud integrations such as Google Drive / OneDrive).
- **Backup Health (RAG Status):** A high-level indicator (Red / Amber / Green) representing system recovery preparedness based on freshness, execution success, and storage availability.
- **Full vs. Partial Backup:** Full system archive vs. user-selected add-ons, folders, and configuration files.
- **Lovelace Card:** A standard Home Assistant frontend UI element configurable via the visual editor or YAML.

## 3. Platform & Version Requirements

- **Target HA version:** 2024.7 or newer. This is the first release with the backup *agents / locations* model that the card depends on (`backup/info`, `backup/agents/info`, `backup/generate`, `backup/delete`, `backup/restore`).
- **Distribution:** HACS. The card ships as an ESM bundle with `hacs.json` and `info.md` for discovery.
- **Tech stack:** TypeScript, Lit (v3), `home-assistant-js-websocket`. Build via Vite/Rollup.
- **Backward compatibility:** not required below 2024.7; the card should surface a clear "unsupported HA version" message when the required websocket commands are unavailable.

## 4. Data Source & API

The card reads telemetry and performs actions exclusively through Home Assistant's websocket API. (Note: a card cannot call *services* the way an automation can — it uses websocket commands, which differ in name from the `backup.*` services.)

| Need                       | Websocket command / source                        | Notes                                                          |
| -------------------------- | ------------------------------------------------ | -------------------------------------------------------------- |
| Health inputs, schedule    | `backup/info`                                     | Returns health + the full `backups` array, `state` (manager state), `last_completed_automatic_backup`, `last_attempted_automatic_backup`, `next_automatic_backup`. |
| Backup inventory           | `backup/info` (`backups[]`)                      | Entries with `backup_id`, `name`, `date`, per-agent `agents` map (size), `with_automatic_settings`. |
| Available stores           | `backup/agents/info`                             | Returns `agents[]` (e.g. `backup.local`, `hassio.local`, remote mounts, `cloud.cloud`). Resolves Local/Remote badges. |
| Create backup              | `backup/generate`                                | Params: `agent_ids`, `name`, `password`, `include_homeassistant`, `include_database`, `include_all_addons`. (Full = all-addons; Partial = `include_all_addons: false`.) |
| Delete backup              | `backup/delete`                                  | Param: `backup_id` (HA term for the backup id; the card calls it `slug`). |
| Restore backup             | `backup/restore`                                 | Params: `backup_id` + `agent_id` + optional `password`/restore options. |

**Live updates:** prefer subscribing to Home Assistant's backup websocket events for real-time status changes rather than only re-polling `backup/info`; fall back to polling when event subscription is unavailable.

Exact command names and parameter shapes must be verified against the running HA websocket API at implementation time.

## 5. Detailed Requirements

### 5.1 Visual & Telemetry Requirements (Monitoring)

#### RAG Backup Health Indicator

- **Green (Healthy):** A successful automatic or manual backup exists within 48 hours, and (if a remote agent/location is configured) at least one remote copy exists.
- **Amber (Warning):** The last successful backup is between >48 hours and 7 days old, OR a local backup exists but the remote copy is missing/failed (only when a remote agent is configured).
- **Red (Critical):** No successful backup in more than 7 days, the last backup job failed, or free storage is below the critical threshold (<1 GB). *Note: free storage is not exposed by the backup websocket API; this input is currently unpopulated, so the Red state relies on freshness and job failure until a storage source is added.*

> Note: the 49-hour–71-hour window (2–3 days) is explicitly covered by Amber, closing the previous gap between Green (≤48h) and Amber (3–7 days).

#### Summary Metrics

- Total count of local backups.
- Total count of remote backups.
- Storage consumption (used/free space per location).
- Timestamp and duration of the last completed backup job.
- Schedule state (e.g. "Next run: Tomorrow at 03:00 AM").

#### Inventory Data Grid

A clean, sortable table or list view rendering individual backup entries showing:

- **Filename / Name**
- **Type:** Full vs. Partial
- **Date & Time Created:** human-readable relative time (e.g. "2 hours ago") with precise timestamp on hover.
- **Size:** in MB/GB.
- **Location Badges:** indicators showing whether the entry exists on `Local`, `Remote`, or `Both` (resolved from `agent_ids`/`location`).
- **Pagination:** the grid must paginate or virtualise when the backup list is large (e.g. >50 entries) to keep the card responsive.

### 5.2 Functional & Operational Requirements (Management)

| **Requirement ID** | **Action**                | **Description**                                                                                                                | **Platform Interaction**                                                                                                 |
| ------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **REQ-ACT-01**     | **Backup Now**            | Triggers an immediate backup job. Provides modal selection for *Full* or *Partial* backup and optional password protection.    | Calls websocket `backup/generate`.                                                                                        |
| **REQ-ACT-02**     | **View / Set Schedule**   | Read-only display of the current schedule (frequency, next run). Deep-links to the native HA schedule editor for changes.      | Reads `schedule` from `backup/info`; "Change" button uses `navigate` to `/config/backup`. In-card schedule editing is **out of scope** (see §10). |
| **REQ-ACT-03**     | **Delete Backup**         | Allows deletion of a selected backup file with a mandatory two-step confirmation prompt.                                       | Calls websocket `backup/delete` with `backup_id`.                                                                          |
| **REQ-ACT-04**     | **Create on Remote**      | **Deferred to v2.** Not implemented in v1; remote operations are reached via REQ-ACT-06 (Open Location) deep-link. A future version may call `backup/generate` targeting a remote `agent_id`. | Deep-link to `/config/backup` only in v1.                                                                                 |
| **REQ-ACT-05**     | **Restore Instance**      | Triggers a system restore using the selected backup archive. Must use a strict two-step confirmation in-card (HA's native `confirm_restore` dialog is not callable from a custom card). | Calls websocket `backup/restore` with `backup_id` + `agent_id`; admin only.                                             |
| **REQ-ACT-06**     | **Open Location**         | Direct navigation shortcut to the native HA Backup Management page.                                                            | Standard `navigate` action to `/config/backup`.                                                                           |

### 5.3 Configuration

The card can be configured via **YAML** or the **visual config editor** (added in v2 — select "Backup Card" in the card picker, or click the card's "Configure" button). Supported options:

- `name` (optional): card title override.
- `threshold_green_hours` (optional, default `48`): maximum age in hours for a Green RAG status.
- `threshold_amber_days` (optional, default `7`): maximum age in days for an Amber RAG status (older than this is Red).
- `threshold_free_gb` (optional, default `1`): free-storage threshold in GB below which RAG is Red.
- `refresh_interval` (optional, default `30`): seconds between background refreshes of `backup/info` while the card is on screen; `0` disables polling.

All thresholds are evaluated by the RAG engine and default to the values above when omitted.

## 6. UI/UX & Theme Integration

- **Home Assistant Design Language:** Card elements must adhere to HA's Material Design principles and consume standard CSS theme variables (e.g. `--primary-color`, `--success-color`, `--warning-color`, `--error-color`, `--card-background-color`).
- **Mobile Responsiveness:** Card must collapse gracefully into a single-column layout on smaller viewports (<480px), hiding secondary table columns while retaining the RAG badge, counts, and primary action buttons.
- **UI States:** Clear visual feedback for state transitions: `Idle`, `Creating Backup...`, `Creating on Remote...`, `Restoring...`, and `Error`.
- **Loading / Empty / Error states:**
  - *Loading:* skeleton or spinner while `backup/info` and `backup/list_backups` resolve.
  - *Empty:* friendly message when no backups exist (distinct from a Red RAG state).
  - *Error:* surfaced message for permission denied, websocket failure, or unsupported HA version, with a retry affordance.
- **Accessibility (a11y):** use semantic roles/labels, keyboard-operable controls and modals, sufficient colour-contrast fallbacks (don't rely on colour alone for RAG — include a text label), and `aria-live` for status transitions.

## 7. Security & Access Control

- **Admin Authorization Only:** administrative controls (Delete, Restore, Trigger) must enforce Home Assistant user role permissions via `hass.user.is_admin`. Non-admin dashboard users see a read-only variant (metrics + inventory only) or have card access restricted via dashboard visibility settings.
- **Destructive Action Protection:** Restoring or deleting backups requires a two-step confirmation flow to prevent accidental data loss.

## 8. Internationalisation

- All user-facing strings must be externalised to `translations/en.json` (and other locales as contributed) rather than hard-coded, per HACS/custom-card conventions.

## 9. Standards & Compliance

Adapted from the project's developer guidelines (originally written for Python integrations; translated for a TypeScript/Lit frontend card):

- **No telemetry / opt-in analytics:** the card must not include third-party tracking, crash reporting (e.g. Sentry), or analytics. No data leaves the user's HA instance except the websocket calls it makes to that instance.
- **No secret logging:** never log `hass` auth tokens, full websocket payloads, or sensitive response data in `console.debug`/`console.log`; scrub before logging.
- **Graceful errors:** handle websocket failures, timeouts, and permission-denied without flooding the UI or console; surface a retry affordance (see §6).
- **Live updates over polling:** subscribe to HA backup websocket events where available instead of only re-polling `backup/info` (see §4).
- **Strict typing & linting:** code must pass `tsc` with strict mode and be ESLint/Prettier clean; aim for HACS-review-quality consistency.
- **Packaging:** ship `hacs.json` (with `render_readme: true`) and `info.md`; optionally submit a card icon to `home-assistant/brands`.
- **Scope note:** integration-only patterns from the guidelines (`DataUpdateCoordinator`, `ConfigFlow`, `aiohttp`, devices/entities, `manifest.json`) do **not** apply to a frontend card.

## 10. Non-Goals / Out of Scope

- **Native core card** (home-assistant/frontend contribution) — explicitly not pursued; this is a HACS custom card.
- **In-card schedule editing** (original REQ-ACT-02) — the backup schedule is a config-entry setting not exposed via a card-callable command; the card displays the schedule and deep-links to `/config/backup` instead.
- **Visual config editor** — shipped in v2 (`<backup-card-editor>`); v1 was YAML-only.
- **Move/Copy local backup to remote / "Create on Remote" (REQ-ACT-04)** — deferred to v2; HA has no copy-local→remote operation, and in-card remote generation is not in v1 scope. v1 reaches remote ops via the Open Location deep-link.

## 11. Acceptance Criteria & Definition of Done

- Card loads and renders on HA 2024.7 and the current release.
- RAG status is correct against seeded scenarios: Green (≤48h + remote when configured), Amber (>48h–7d, or local-ok/remote-missing), Red (>7d, last job failed, or <1 GB free); thresholds honour the configurable values from §5.3.
- Actions behave per §5.2: ACT-01/03/05/06 execute or deep-link as specified; ACT-04 is deferred to v2 (§10); no action references non-existent `backup.create`/`backup.delete`/`confirm_restore` services.
- Non-admin users see the read-only variant; admin-gated actions are hidden/disabled.
- Loading, empty, and error states are implemented and verified.
- Card passes HACS validation; `tsc` and lint run clean; unit tests cover the RAG engine and websocket layer (mocked).
- README + `info.md` + `hacs.json` published; i18n `en.json` present.
