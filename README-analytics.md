# Norys Analytics Admin Panel

## Run locally

1. Start the server:

```bash
ADMIN_TOKEN="your-strong-token" node server.js
```

2. Open the site:
- Main page: `http://localhost:8080/`
- Admin dashboard: `http://localhost:8080/admin`

3. In admin dashboard, enter the same `ADMIN_TOKEN` and click **Connect**.

## What is tracked on `index.html`

- `page_view` on load
- `click` on links/buttons/interactive elements
- `scroll_depth` milestones (25/50/75/100)
- `heartbeat` every 15 seconds (near real-time session signal)
- `visibility_change` (tab active/hidden)
- `session_end` with:
  - `durationSec`
  - interaction count
  - max scroll depth

## Dashboard metrics

- Total page visits
- Unique visitors
- Total click count
- Average time on page
- Bounce rate / quick exits (short/low-interaction sessions)
- Trends over time (visits + clicks)
- Top clicked elements
- Detailed activity event log

## Storage

All events are appended to:

`data/events.ndjson`

This is easy to extend with new event types and can later be migrated to a DB without changing the tracker event model.
