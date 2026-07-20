# WA-Monitor - Enterprise WhatsApp Group Tracker

Enterprise WhatsApp group activity tracker and intelligence dashboard. Tracks group members, messages, reactions, polls, and events via a web dashboard with real-time analytics and CSV/JSON reporting.

## WhatsApp Account

No WhatsApp Business account or API subscription is needed — a regular WhatsApp account works.

You can use your own WhatsApp account or a dedicated one. The monitor connects as a linked device and passively tracks group activity without interfering with normal use.

If the service restarts, it automatically catches up on messages it missed while offline. However, if you disconnect (unlink the device) and re-connect, messages sent while disconnected will not be recovered.

## Deployment



### Docker

```bash
cp .env.example .env
# Edit .env: set ADMIN_PASSWORD
docker compose up --build
```

Data is persisted in a named Docker volume.

### Local

Requires Node.js 22+ and npm.

```bash
npm install
cp .env.example .env
# Edit .env: set ADMIN_PASSWORD
npm run dev
```

## Getting Started

1. Open the web panel and log in
2. Scan the QR code with WhatsApp (Linked Devices > Link a Device)
3. The dashboard shows all groups the account is in, with member counts and activity stats

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ADMIN_PASSWORD` | *(required)* | Password for the web panel |
| `ADMIN_USERNAME` | `admin` | Username for the web panel |
| `DATA_DIR` | `./data` | Directory for auth state and database |

Additional settings (project name, page size) are configurable from the Settings page.

## How It Works

When you use web.whatsapp.com, you link your WhatsApp account to the browser by scanning a QR code. Through WhatsApp Web you can send and receive messages and do pretty much everything you can do in the mobile app. Baileys is a library that **reverse-engineered the WhatsApp Web protocol**, allowing us to connect to WhatsApp as if we were a browser. This means we can track all the same events and data that WhatsApp Web has access to, including group activity.

Similarly, you need to **connect** the monitor to your WhatsApp account by scanning a QR code. WhatsApp allows up to 4 linked devices at a time. Once connected, the session credentials are saved to your data directory. After that, you can stop the container and restart it without needing to scan the QR code again.

If you restart the container while it was connected, the WhatsApp protocol will re-send all events that occurred while the monitor was offline. You can even restart after several days and catch up on everything you missed.

## Backup, Restore, and Migration

You can back up your data at any time.

Here is the recommended workflow for **migrating** your monitor to a new server or instance (local ↔ Docker ↔ Railway):
- Keep the old instance running and connected to WhatsApp.
- Start the new instance and connect it to WhatsApp by scanning the QR code. Both instances are now connected and tracking the same data in parallel (WhatsApp allows up to 4 linked devices).
- Use the backup feature on the old instance to download a backup file.
- Use the restore feature on the new instance to upload the backup file and apply it using the **merge** option.
- Disconnect the old instance from WhatsApp (unlink the device) and stop it.

Any events that occurred after the backup was taken but before the restore will already be present in the new instance, so no data will be lost.

## Data Isolation

Each WhatsApp account gets its own database at `data/{phone}/account.db`. Disconnecting and connecting a different number creates a separate database — no data mixing between accounts. Shared settings are stored in `data/monitor.db`.

Only one WhatsApp account can be connected at a time. Activity is only tracked while the account is connected. If you need to monitor multiple accounts simultaneously, set up a separate instance (container) for each one.

## Tech Stack

Baileys (WhatsApp Web) + Fastify + SQLite (better-sqlite3) + Drizzle ORM + TypeScript


