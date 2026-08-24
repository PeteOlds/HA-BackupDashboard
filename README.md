# HA Backup Card

A custom [Home Assistant](https://www.home-assistant.io/) Lovelace card for
monitoring backup health and running common backup management actions directly
from a dashboard.

## Features

- RAG health badge (Green / Amber / Red) based on backup freshness, job success,
  and free storage.
- Summary metrics: local/remote backup counts, storage use, last job, schedule.
- Sortable, paginated backup inventory with Local / Remote / Both badges.
- Actions: Backup Now, Delete, Restore, Open Backup Manager (admin-gated).
- Configurable thresholds; read-only variant for non-admin users.
- No telemetry, no secret logging.

## Install (HACS)

1. Add this repo as a HACS custom repository (type: Lovelace).
2. Install **Backup Card**.
3. Add the card via the visual editor or YAML:

```yaml
type: custom:backup-card
name: My Backups
threshold_green_hours: 48
threshold_amber_days: 7
threshold_free_gb: 1
```

## Requirements

- Home Assistant **2024.7+** (backup agents / locations model).
- An admin account for management actions; non-admins get a read-only view.

See `PRD HA Backup Card.md` and `DESIGN.md` for the full specification.
