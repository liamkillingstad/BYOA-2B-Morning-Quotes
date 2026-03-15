# Daily Reflections

A warm, literary reflection app that greets you when your Mac wakes from sleep or when you log in. Before you dive into your day, it invites you to reflect on gratitude, excitement, and intention—with an optional algebra puzzle and a quote to ponder.

## Features

- **Three reflection questions** (required): gratitude, excitement, and one important task
- **Optional algebra problem** (medium–hard difficulty)
- **Quote gate**: type the displayed quote to complete and close
- **Local storage**: entries saved to SQLite in your app data folder
- **Wake & login detection**: shows when your Mac wakes from sleep or when you unlock
- **Override**: "Minimize for now" if you need to skip

## Setup

```bash
npm install
```

## Development

```bash
npm run electron:dev
```

This starts the Vite dev server and launches Electron. The app loads from `http://localhost:5173` with hot reload.

## Production Build

```bash
npm run build
npm run electron
```

## Run at Login (macOS)

To have Daily Reflections open when you log in:

1. Open **System Settings → General → Login Items**
2. Click **+** and add the app (after building, it will be in the `dist` folder or wherever you install it)
3. Or: right-click the app in Finder → **Options → Open at Login**

## Data Location

Entries are stored in SQLite at:
- **macOS**: `~/Library/Application Support/morning-notes/morning-notes.db`
