---
"@aliou/pi-synthetic": patch
---

Remove quota fetch on session start. Quotas are now only ingested from response headers on demand, avoiding an unnecessary authenticated API call when the session loads.
