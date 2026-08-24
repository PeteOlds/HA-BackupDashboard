# HA Backup Card

A custom Home Assistant Lovelace card for backup status & management.

See the [README](https://github.com/example/lovelace-backup-card) for install and
configuration, and `PRD HA Backup Card.md` / `DESIGN.md` for the full spec.

```yaml
type: custom:backup-card
name: My Backups
threshold_green_hours: 48
threshold_amber_days: 7
threshold_free_gb: 1
```
